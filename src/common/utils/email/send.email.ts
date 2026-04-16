import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { BadRequestExaption } from '../../exception';
import { APP_EMAIL, APP_EMAIL_PASSWORD, APPLICATION_NAME } from '../../../config/config';

export const sendEmail = async ({
    to,
    cc,
    bcc,
    html,
    subject,
    attachments = [],
}: Mail.Options):Promise<void>=> {
    
    // 1. التحقق من وجود مستلم (مستقبل) للرسالة
    if (!to && !cc && !bcc) {
        throw new BadRequestExaption("Invalid recipient");
    }

    // 2. التحقق من وجود محتوى للرسالة (نص أو ملفات مرفقة)
    if (!(html as string)?.length && !attachments?.length) {
        throw new BadRequestExaption("Invalid mail content");
    }

    // 3. إعداد الـ Transporter (مزود الخدمة - Gmail هنا)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: APP_EMAIL,          // الإيميل اللي هيبعت
            pass: APP_EMAIL_PASSWORD, // الباسورد الخاص بالتطبيقات (App Password)
        },
    });

    // 4. إرسال الإيميل
    const info = await transporter.sendMail({
        to,
        cc,
        bcc,
        html,
        subject,
        attachments,
        from: `"${APPLICATION_NAME} 🌸" <${APP_EMAIL}>`, // اسم التطبيق اللي هيظهر للمستخدم
    });

    console.log("Message sent:", info.messageId);
};