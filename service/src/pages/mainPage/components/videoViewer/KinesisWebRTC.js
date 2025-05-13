import { SignalingClient } from "amazon-kinesis-video-streams-webrtc";
import AWS from "aws-sdk";

// clientId 생성 함수 -> 랜덤 생성
const getRandomClientId = () => {
    return Math.random()
        .toString(36)
        .substring(2)
        .toUpperCase();
};

export const KinesisWebRTC = async ({ channelName, region, credentials, videoRef, setError }) => {
    let signalingClient = null;
    let peerConnection = null;
    let currentStreamId = null;
    let isPlaying = false;

    const initializeWebRTC = async () => {
        try {
            // 기존 연결 정리
            if (peerConnection) {
                peerConnection.close();
                peerConnection = null;
            }
            if (signalingClient) {
                signalingClient.close();
                signalingClient = null;
            }
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }

            // 키 하드 코딩함. Git 업로드 시 삭제하고 올릴 것
            const credentials = {
                accessKeyId: "",
                secretAccessKey: "",
                // sessionToken: "YOUR_AWS_SESSION_TOKEN", 
            };

            // Kinesis Video 클라이언트 초기화
            const kinesisVideoClient = new AWS.KinesisVideo({
                region,
                credentials,
                correctClockSkew: true,
            });

            // 채널 ARN 조회
            const { ChannelInfo } = await kinesisVideoClient
                .describeSignalingChannel({ ChannelName: channelName })
                .promise();
            const channelARN = ChannelInfo.ChannelARN;

            // 엔드포인트 조회
            const { ResourceEndpointList } = await kinesisVideoClient
                .getSignalingChannelEndpoint({
                    ChannelARN: channelARN,
                    SingleMasterChannelEndpointConfiguration: { Protocols: ["WSS", "HTTPS"], Role: "VIEWER" },
                })
                .promise();

            const endpoints = ResourceEndpointList.reduce((acc, { Protocol, ResourceEndpoint }) => {
                acc[Protocol] = ResourceEndpoint;
                return acc;
            }, {});

            // ICE 서버 구성 (STUN + TURN)
            console.log('Creating ICE server configuration...');
            const signalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
                region,
                endpoint: endpoints.HTTPS,
                credentials,
                correctClockSkew: true,
            });

            console.log('Getting ICE server config...');
            const { IceServerList } = await signalingChannelsClient
                .getIceServerConfig({ ChannelARN: channelARN })
                .promise();
            console.log('ICE servers:', IceServerList);  // 획득한 ICE 서버 목록 로깅

            const iceServers = [
                { urls: `stun:stun.kinesisvideo.${region}.amazonaws.com:443` },
                ...IceServerList.map(({ Uris, Username, Password }) => ({
                    urls: Uris,
                    username: Username,
                    credential: Password,
                })),
            ];
            console.log('Final ICE Servers:', iceServers);  // 최종 ICE 서버 구성 출력

            // SignalingClient 초기화
            console.log(`Creating signaling client...`);
            signalingClient = new SignalingClient({
                channelARN,
                channelEndpoint: endpoints.WSS,
                region,
                role: "VIEWER",
                credentials,
                clientId: getRandomClientId(),
                systemClockOffset: kinesisVideoClient.config.systemClockOffset,
            });
            // Signaling Client 이벤트 리스너
            signalingClient.on('open', () => console.log('[Signaling] Connection opened!'));
            signalingClient.on('error', (err) => console.error('[Signaling] Error:', err));
            signalingClient.on('close', () => console.log('[Signaling] Connection closed'));

            // WebRTC 설정
            peerConnection = new RTCPeerConnection({ iceServers });

            // onloadedmetadata 핸들러 단일 등록
            if (videoRef.current) {
                videoRef.current.onloadedmetadata = () => {
                    console.log('[Video] Metadata loaded at:', new Date().toISOString());
                    if (!videoRef.current) {
                        console.warn('[Video] videoRef.current is null, skipping play');
                        return;
                    }
                    if (!isPlaying && videoRef.current.paused) {
                        isPlaying = true;
                        videoRef.current.play()
                            .then(() => {
                                console.log('[Video] Play started at:', new Date().toISOString());
                                isPlaying = false;
                            })
                            .catch((err) => {
                                console.error("Video play failed:", err);
                                setError("비디오 재생 실패: " + err.message);
                                isPlaying = false;
                            });
                    }
                };
            }

            //<------ PeerConnection 이벤트 리스너
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    signalingClient.sendIceCandidate(event.candidate);
                    //console.log('[ICE] Candidate:', event.candidate);
                } else {
                    console.log('[ICE] All candidates gathered');
                }
            };

            peerConnection.oniceconnectionstatechange = () => {
                console.log('[ICE] State:', peerConnection.iceConnectionState);
                if (peerConnection.iceConnectionState === 'failed') {
                    console.error('[ICE] Connection failed');
                    setError("ICE 연결 실패");
                }
            };

            peerConnection.onsignalingstatechange = () => {
                console.log('[Signaling] State:', peerConnection.signalingState);
            };

            peerConnection.ontrack = (event) => {
                console.log('[Track] Received track:', event.track);
                console.log('[Track] videoRef.current:', videoRef.current);
                console.log('[Track] event.streams:', event.streams);

                if (!videoRef.current) {
                    console.error("Video element is not mounted!");
                    return;
                }
                if (event.streams && event.streams[0]) {
                    const stream = event.streams[0];
                    if (currentStreamId === stream.id) {
                        console.log('[Track] Duplicate stream, ignoring:', stream.id);
                        return;
                    }
                    currentStreamId = stream.id;

                    console.log('[Track] Stream active:', stream.active);
                    console.log('[Track] Stream tracks:', stream.getTracks());

                    // 기존 스트림 정리
                    if (videoRef.current.srcObject) {
                        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                        videoRef.current.srcObject = null;
                    }

                    videoRef.current.srcObject = stream;
                    videoRef.current.playsInline = true;
                    videoRef.current.muted = true;

                    console.log('[Track] srcObject set:', videoRef.current.srcObject);
                    stream.getTracks().forEach(track => {
                        console.log('[Track] Track details:', {
                            kind: track.kind,
                            id: track.id,
                            enabled: track.enabled,
                            readyState: track.readyState,
                            muted: track.muted,
                        });
                        track.onunmute = () => console.log('[Track] Track unmuted');
                        track.onmute = () => console.log('[Track] Track muted');
                    });
                } else {
                    console.error('[Track] No streams received');
                }
            };
            // PeerConnection 이벤트 리스너----->
            signalingClient.on("open", async () => {
                try {
                    // // 로컬 스트림 획득
                    // const constraints = {
                    //     video: true,
                    //     audio: false,
                    // };
                    // const localStream = await navigator.mediaDevices.getUserMedia(constraints);
                    // localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

                    const offer = await peerConnection.createOffer({
                        offerToReceiveVideo: true,
                        offerToReceiveAudio: true,
                    });
                    console.log('[SDP] Offer created:', offer.sdp.slice(0, 100) + '...');  // SDP 요약 출력
                    await peerConnection.setLocalDescription(offer);
                    signalingClient.sendSdpOffer(offer);
                } catch (err) {
                    setError("SDP Offer 생성에 실패했습니다.");
                    console.error("SDP Offer error:", err);
                }
            });

            signalingClient.on("sdpAnswer", async (answer) => {
                console.log('[SDP] Received answer:', answer.sdp.slice(0, 100) + '...');
                try {
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
                } catch (err) {
                    setError("SDP Answer 처리에 실패했습니다.");
                    console.error("SDP Answer error:", err);
                }
            });

            signalingClient.on("iceCandidate", (candidate) => {
                console.log('[ICE] Received candidate:', candidate);
                peerConnection.addIceCandidate(candidate);
            });

            signalingClient.on("error", (err) => {
                setError("연결에 실패했습니다.");
                console.error("Signaling error:", err);
            });

            signalingClient.open();
        } catch (err) {
            setError("설정에 실패했습니다.");
            console.error("Setup error:", err);
            throw err; // 호출자에게 에러 전파
        }
    };

    // 초기 WebRTC 연결 실행
    await initializeWebRTC();

    // 클린업 함수
    const cleanup = () => {
        if (peerConnection) {
            peerConnection.close();
            peerConnection = null;
        }
        if (signalingClient) {
            signalingClient.close();
            signalingClient = null;
        }
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    // 재연결 함수
    const reconnect = async () => {
        console.log(`Reconnecting WebRTC for channel: ${channelName}`);
        try {
            await initializeWebRTC();
            console.log(`WebRTC reconnected for channel: ${channelName}`);
        } catch (err) {
            setError("재연결에 실패했습니다: " + err.message);
            console.error("Reconnect error:", err);
            throw err;
        }
    };

    return {
        cleanup,
        reconnect,
    };
};
