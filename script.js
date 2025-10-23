document.addEventListener('DOMContentLoaded', () => {
    // Google Apps Script 웹 앱 URL
    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyYcPuC_PwlVgIJWCZ83BMehbxRS9rqkDH2OXRkoOg9I8TWD3AqX2IxERC9tTHZqnv3Tw/exec';

    const recordForm = document.getElementById('record-form');
    const recordsContainer = document.getElementById('records-container');
    const exportButton = document.getElementById('export-excel');
    const chartCanvas = document.getElementById('mood-chart'); // 통계용
    let recordsCache = [];
    let statsChart;

    // 데이터 불러오기
    const loadRecords = async () => {
        try {
            const response = await fetch(WEB_APP_URL, { method: 'GET', redirect: 'follow' });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            recordsCache = await response.json();
            if (!Array.isArray(recordsCache)) throw new Error('Google Apps Script에서 에러 발생');

            // 최신순 정렬 (Timestamp 기준)
            recordsCache.sort((a,b) => new Date(b.Timestamp) - new Date(a.Timestamp));

            recordsContainer.innerHTML = '';
            recordsCache.forEach(addRecordToDOM);
            renderChart();

        } catch (error) {
            console.error(error);
            recordsContainer.innerHTML = `<p style="color:red;">데이터를 불러오는 데 실패했습니다.</p>`;
        }
    };

    // 기록 DOM에 추가
    const addRecordToDOM = (record) => {
        const row = document.createElement('div');
        row.classList.add('record-row');

        row.innerHTML = `
            <div>${record.weeklyGames || '-'}</div>
            <div>${record.dailyHours || '-'}</div>
            <div>${record.payStatus || '-'}</div>
            <div>${record.payAmount || '-'}</div>
            <div>${record.payReason || '-'}</div>
        `;
        recordsContainer.appendChild(row);
    };

    // 차트 렌더링 (하루 플레이 시간별)
    const renderChart = () => {
        const counts = recordsCache.reduce((acc, record) => {
            acc[record.dailyHours] = (acc[record.dailyHours] || 0) + 1;
            return acc;
        }, {});

        const data = {
            labels: Object.keys(counts),
            datasets: [{
                label: '하루 플레이 시간별 인원',
                data: Object.values(counts),
                backgroundColor: ['#FFC107','#FF7043','#8BC34A','#2196F3','#9C27B0'],
                hoverOffset: 4
            }]
        };

        if(statsChart) statsChart.destroy();

        statsChart = new Chart(chartCanvas, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: '하루 플레이 시간별 통계' }
                }
            }
        });
    };

    // 폼 제출
    recordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = recordForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = '저장 중...';

        const formData = new FormData(recordForm);
        const data = {
            weeklyGames: formData.get('weeklyGames'),
            dailyHours: formData.get('dailyHours'),
            payStatus: formData.get('payStatus'),
            payAmount: formData.get('payAmount'),
            payReason: formData.get('payReason')
        };

        try {
            await fetch(WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                redirect: 'follow',
                body: JSON.stringify(data)
            });

            alert('성공적으로 기록되었습니다!');
            recordForm.reset();
            loadRecords();

        } catch (error) {
            console.error(error);
            alert('기록 저장에 실패했습니다.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '기록하기';
        }
    });

    // 엑셀 내보내기
    exportButton.addEventListener('click', () => {
        if (recordsCache.length === 0) {
            alert('내보낼 데이터가 없습니다.');
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(recordsCache);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "과금 기록");
        XLSX.writeFile(workbook, "payment_records.xlsx");
    });

    // 초기 데이터 로드
    loadRecords();
});
