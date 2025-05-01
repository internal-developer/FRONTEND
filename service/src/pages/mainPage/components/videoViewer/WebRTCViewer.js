// src/components/videoViewer/WebRTCViewer.js
import React, { useEffect, useRef } from "react";
import AWS from "aws-sdk";
import { SignalingClient, Role } from "amazon-kinesis-video-streams-webrtc";

export default function WebRTCViewer({
    channelName,
    region = "ap-northeast-2",
    accessKeyId,
    secretAccessKey,
    sessionToken = null,
}) {
    const videoRef = useRef(null);
    let signalingClient = useRef(null);
    let peerConnection = useRef(null);

    useEffect(() => {
        const startViewer = async () => {
            // 1) AWS SDK v2 설정
            AWS.config.update({
                accessKeyId,
                secretAccessKey,
                sessionToken,
                region,
            });

            // 2) 채널 ARN 조회
            const kv = new AWS.KinesisVideo();
            const desc = await kv
                .describeSignalingChannel({ ChannelName: channelName })
                .promise();
            const channelARN = desc.ChannelInfo.ChannelARN;

            // 3) 엔드포인트 조회
            const ep = await kv
                .getSignalingChannelEndpoint({
                    ChannelARN: channelARN,
                    SingleMasterChannelEndpointConfiguration: {
                        Protocols: ["WSS", "HTTPS"],
                        Role: "VIEWER",
                    },
                })
                .promise();
            const endpoints = ep.ResourceEndpointList.reduce(
                (acc, { Protocol, ResourceEndpoint }) => {
                    acc[Protocol] = ResourceEndpoint;
                    return acc;
                },
                {}
            );

            // 4) ICE 서버 설정
            const kvsc = new AWS.KinesisVideoSignalingChannels({
                endpoint: endpoints.HTTPS,
            });
            const iceResp = await kvsc
                .getIceServerConfig({
                    ChannelARN: channelARN,
                    ClientId: ``,
                })
                .promise();
            const iceServers = iceResp.IceServerList.map((s) => ({
                urls: s.Uris,
                username: s.Username,
                credential: s.Password,
            }));
            // 기본 STUN
            iceServers.unshift({
                urls: `stun:stun.kinesisvideo.${region}.amazonaws.com:443`,
            });

            // 5) RTCPeerConnection 생성
            peerConnection.current = new RTCPeerConnection({ iceServers });
            const remoteStream = new MediaStream();
            if (videoRef.current) videoRef.current.srcObject = remoteStream;
            peerConnection.current.ontrack = (evt) =>
                remoteStream.addTrack(evt.track);
            peerConnection.current.onicecandidate = ({ candidate }) => {
                if (candidate)
                    signalingClient.current.sendIceCandidate(candidate);
            };

            // 6) SignalingClient 생성
            signalingClient.current = new SignalingClient({
                channelARN,
                channelEndpoint: endpoints.WSS,
                role: Role.VIEWER,
                region,
                credentials: AWS.config.credentials,
            });

            signalingClient.current.on("open", async () => {
                // Offer 생성
                const offer = await peerConnection.current.createOffer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true,
                });
                await peerConnection.current.setLocalDescription(offer);
                signalingClient.current.sendSdpOffer(offer);
            });

            signalingClient.current.on("sdpAnswer", ({ sdpAnswer }) => {
                peerConnection.current.setRemoteDescription(sdpAnswer);
            });
            signalingClient.current.on("iceCandidate", ({ candidate }) => {
                peerConnection.current.addIceCandidate(candidate);
            });

            signalingClient.current.open();
        };

        startViewer().catch(console.error);

        return () => {
            // Cleanup
            signalingClient.current?.close();
            peerConnection.current?.close();
        };
    }, [channelName, region, accessKeyId, secretAccessKey, sessionToken]);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "100%", backgroundColor: "#000" }}
        />
    );
}
