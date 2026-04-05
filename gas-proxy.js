/**
 * 더 스파이크 분석 - Gemini API Proxy
 * Google Apps Script Web App
 *
 * 배포 방법:
 * 1. script.google.com 에서 새 프로젝트 생성
 * 2. 이 코드 붙여넣기
 * 3. 프로젝트 설정 > 스크립트 속성 > 속성 추가:
 *    키: GEMINI_API_KEY
 *    값: (Google AI Studio에서 발급한 키)
 * 4. 배포 > 새 배포 > 유형: 웹 앱
 *    - 다음 사용자로 실행: 나
 *    - 액세스 권한: 모든 사용자 (익명)
 * 5. 배포 후 나오는 URL을 복사 → index.html의 GAS_URL에 붙여넣기
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');

    if (!apiKey) {
      return jsonResponse({ error: 'API key not configured in Script Properties.' }, 500);
    }

    const geminiRes = UrlFetchApp.fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey,
      {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({
          contents: [{ parts: [{ text: data.prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        }),
        muteHttpExceptions: true
      }
    );

    return ContentService
      .createTextOutput(geminiRes.getContentText())
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

// 헬스체크용 (브라우저에서 URL 직접 열면 동작 확인 가능)
function doGet(e) {
  return jsonResponse({ status: 'ok', message: '더 스파이크 분석 Proxy is running.' });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
