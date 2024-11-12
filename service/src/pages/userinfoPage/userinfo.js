import './userinfo.scss';


export default function UserInfoPage() {
    return (
        <div className="userinfo-container">
            <div className="form-container">
                <form>
                    <label>
                        닉네임을 입력해주세요.
                        <input type="text" placeholder="8-16자의 한글만 사용 가능합니다." />
                    </label>
                    <label>
                        전화번호를 입력해주세요.
                        <input type="text" placeholder="010-1234-5678" />
                    </label>
                    <label>
                        역할을 선택해주세요.
                        <select>
                            <option value="">역할을 선택해주세요.</option>
                            <option value="role1">관리자</option>
                            <option value="role2">매니저</option>
                            <option value="role3">일반 사용자</option>
                        </select>
                    </label>
                    <button type="submit">시작하기</button>
                </form>
            </div>
        </div>
    );
}
