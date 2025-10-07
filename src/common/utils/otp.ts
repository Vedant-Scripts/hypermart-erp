import crypto from 'crypto';
import { delRedisValue, getRedisValue, setRedisValue } from '../integrations/redis.integration.js';
import config from '../../config/env.config.js';
import { EXTERNAL_API_ENDPOINTS } from './constant.js';
import axios from 'axios';

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashOtp(otp: string) {
    return crypto.createHash('sha256').update(String(otp)).digest('hex');
}

// saving OTP to redis
export const storeOtpRedis = async (type: string, identifier: string, otp: string) => {
    const key = `${type}:${identifier}`;
    const value = hashOtp(otp);
    return setRedisValue(key, config.redis.otpExpiresIn, value);
}

// verifying OTP to redis
export const verifyOtpRedis = async (type: string, identifier: string, otp: string) => {
    const key = `${type}:${identifier}`;
    const storedOtp = await getRedisValue(key);

    if (!storedOtp) return { success: false, reason: 'expired' }
    if (storedOtp !== hashOtp(otp)) return { success: false, reason: 'invalid' }

    // Delete OTP key after successful verification
    await delRedisValue(key);

    return { success: true }
}


export const sendOtpToMobile = async (identifier: string, otp: string) => {
    const url = EXTERNAL_API_ENDPOINTS.MSG_91_SEND_SMS;

    const requestBody = {
        "template_id": config.msg91.msgDltTemplateIdOtp,
        "recipients": [
            {
                "mobiles": `${identifier}`,
                "VAR1": otp
            }
        ]
    }

    const response = await axios.post(url, requestBody, {
        headers: {
            'Accept': 'application/json',
            'authKey': config.msg91.authKey,
            'Content-Type': 'application/json'
        }
    });

    if (response.data.type !== 'success') throw new Error(`Error sending otp to to mobile no : ${identifier}`);

    return response.data;
}