// script.js
document.addEventListener('DOMContentLoaded', () => {
    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz-bZbyoV1zxr5k5QeoBcBuIg0V9L3CAqoBrrwBF3wQGVAuk4CtSBCUQzdDKdK7KZhAgw/exec'; // <- 반드시 변경

   const form = document.getElementById('survey-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = '💌 제출 중...';

        const formData = new FormData(form);
        const data = {
            age: formData.get('age'),
            weeklyGames: formData.get('weekly-games'),
            dailyHours: formData.get('daily-hours'),
            payStatus: formData.get('pay-status'),
            payReason: formData.get('pay-reason'),
            payAmount: formData.get('pay-amount'),
            paySource: formData.get('pay-source')
        };

        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbz-bZbyoV1zxr5k5QeoBcBuIg0V9L3CAqoBrrwBF3wQGVAuk4CtSBCUQzdDKdK7KZhAgw/exec', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // 필수
                body: JSON.stringify(data)
            });

            const result = await response.json(); // Apps Script가 JSON으로 반환한다고 가정
            console.log(result);

            alert('💝 설문이 성공적으로 제출되었습니다!');
            form.reset();
        } catch (error) {
            console.error('전송 오류:', error);
            alert('⚠️ 제출 중 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '💝 제출하기';
        }
    });
});
