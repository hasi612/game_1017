// JS 연결 확인용
console.log('✅ JS 파일 연결됨');

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyqXDRB-DbfCVKLS2pYaGPF0fo8v2UwfYm1WtQ8jboztmG9GBJtkgpqGTt_eKpAmXlboA/exec';
const form = document.getElementById('survey-form'); // ✅ 수정됨

if (!form) {
  console.error('❌ form 요소를 찾을 수 없습니다. ID를 확인하세요.');
} else {
  console.log('✅ form 연결 성공');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = '제출 중...';

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
    await fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(data)
    });

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
