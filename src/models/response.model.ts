/**
 * 기본 응답 모델
 */

export interface BasicResponseModel {
    /**
     * 오류 메시지
     */
    message: string;
    /**
     * 성공 실패 여부, true: 성공, false: 실패
     */
    success: boolean;
    /**
     * 처리 내용 반환
     */
    data: any;
}