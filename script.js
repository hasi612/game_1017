document.addEventListener('DOMContentLoaded', () => {
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwLDtXspwFqWLOkuW63dDub6dQ0rrrbMYbshcfQw-H2uQMN25RnfJalh6EikTB8oEPtJw/exec'; // 배포 URL

  const recordForm = document.getElementById('record-form');
  const recordsContainer = document.getElementById('records-container');

  // 오늘 날짜 기본 설정
  document.getElementById('date').value = new Date().toISOString().split('T')[0];

  // 데이터 전송
  recordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = '저장 중...';

    const formData = new FormData(recordForm);
    const data = {
      age: formData.get('age'),
      date: formData.get('date'),
      weeklyGames: formData.get('weeklyGames'),
      dailyHours: formData.get('dailyHours'),
      payStatus: formData.get('payStatus'),
      payAmount: formData.get('payAmount'),
      payReason: formData.get('payReason')
    };

    try {
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', // 중요! CORS 방지용
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      alert('💝 설문이 성공적으로 제출되었습니다!');
      recordForm.reset();
      document.getElementById('date').value = new Date().toISOString().split('T')[0];
    } catch (err) {
      console.error('전송 오류:', err);
      alert('⚠️ 제출 중 오류가 발생했습니다.');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = '기록하기';
    }
  });
});
