export const signUpTemp = (link) => `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأكيد الحساب</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; color: #333333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
        .logo { font-size: 24px; font-weight: bold; color: #4F46E5; margin-bottom: 20px; }
        h1 { color: #1F2937; font-size: 22px; margin-bottom: 10px; }
        p { font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 30px; }
        .btn { display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: #ffffff !important; text-decoration: none; font-weight: bold; border-radius: 5px; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3); }
        .footer { margin-top: 30px; font-size: 12px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">موقعك / شركتك</div>
        <h1>أهلاً بك معنا! 👋</h1>
        <p>سعداء جداً بانضمامك إلينا. يرجى الضغط على الزر بالأسفل لتفعيل حسابك والبدء في الاستخدام:</p>
        <a href="${link}" class="btn" target="_blank">تفعيل الحساب</a>
        <p style="margin-top: 25px; font-size: 14px; color: #6B7280;">إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذا البريد الإلكتروني بأمان.</p>
        <div class="footer">
            جميع الحقوق محفوظة © 2026
        </div>
    </div>
</body>
</html>`;
export const resetPassTemp = (code) => `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إعادة تعيين كلمة المرور</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; color: #333333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
        .logo { font-size: 24px; font-weight: bold; color: #EF4444; margin-bottom: 20px; }
        h1 { color: #1F2937; font-size: 22px; margin-bottom: 10px; }
        p { font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 25px; }
        .code-container { display: inline-block; background-color: #F3F4F6; border: 2px dashed #D1D5DB; padding: 15px 40px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1F2937; border-radius: 6px; margin-bottom: 25px; }
        .footer { margin-top: 30px; font-size: 12px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">موقعك / شركتك</div>
        <h1>إعادة تعيين كلمة المرور 🔐</h1>
        <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك. استخدم الرمز التالي لإتمام العملية:</p>
        <div class="code-container">${code}</div>
        <p style="font-size: 14px; color: #6B7280;">هذا الرمز صالح لفترة محدودة. إذا لم تطلب هذا التغيير، يرجى تجاهل هذا الإيميل وتأمين حسابك.</p>
        <div class="footer">
            جميع الحقوق محفوظة © 2026
        </div>
    </div>
</body>
</html>`;
