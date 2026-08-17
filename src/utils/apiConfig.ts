export const BASE_URL = 'https://api.codingboss.in';

export const ENDPOINTS = {
    signup: `${BASE_URL}/gobi360/signup/`,
    login: `${BASE_URL}/gobi360/login/`,
    profile: `${BASE_URL}/onetouch/profile/`,
    missedCall: `${BASE_URL}/onetouch/missed_call/`,
    userDetails: `${BASE_URL}/service_app/user-details/`,
    notAttended: `${BASE_URL}/service_app/not-attended-data/`,
    callLog: `${BASE_URL}/onetouch/call-log/`,
    shopkeeperLogin: `${BASE_URL}/gobi360/shopkeeper/login/`,

    // Expert Endpoints
    expertServiceRequest: (expertId: number | string) => `${BASE_URL}/gobi360/expert/service-request/${expertId}/`,
    expertServiceRequestUpdate: (requestId: number | string) => `${BASE_URL}/gobi360/expert/service-request/update/${requestId}/`,
    expertRewardSetting: (userId: number | string) => `${BASE_URL}/gobi360/expert/reward-setting/${userId}/`,
    expertRewardSettingUpdate: (userId: number | string) => `${BASE_URL}/gobi360/expert/reward-setting/update/${userId}/`,
    expertServices: (expertId: number | string) => `${BASE_URL}/gobi360/experts/${expertId}/services/`,

    // Customer Endpoints
    customerRewardPoints: (userId: number | string) => `${BASE_URL}/gobi360/customer/reward-points/${userId}/`,
    customerExpertPoints: (userId: number | string, expertId: number | string) => `${BASE_URL}/gobi360/customer/expert-points/${userId}/${expertId}/`,
    customerServiceOrders: (userId: number | string) => `${BASE_URL}/gobi360/customer/service-orders/${userId}/`,
    customerServiceOrder: (requestId: number | string, userId: number | string) => `${BASE_URL}/gobi360/customer/service-order/${requestId}/${userId}/`,
    customerServiceOrderRedeemPoints: (requestId: number | string) => `${BASE_URL}/gobi360/customer/service-order/redeem-points/${requestId}/`,

    // Call Endpoints
    callRequest: `${BASE_URL}/gobi360/call-request/`,
    callRequestList: `${BASE_URL}/gobi360/call-request-list/`,
};