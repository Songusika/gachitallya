import axios from "axios";
import CryptoJS from "crypto-js";

export default async function reservationMsg(to, message, time) {
  const date = Date.now().toString();
  const uri = "ncp:sms:kr:296287138612:gatitallya";
  const secretKey = "qfkcU9P3AKqKEz7Gi6Mp3pVgwCOe8MmolhYXOzRg";
  const accessKey = "b5n6ENatOznpTn79q74F";
  const method = "POST";
  const space = " ";
  const newLine = "\n";
  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
  const url2 = `/sms/v2/services/${uri}/messages`;

  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

  hmac.update(method);
  hmac.update(space);
  hmac.update(url2);
  hmac.update(newLine);
  hmac.update(date);
  hmac.update(newLine);
  hmac.update(accessKey);

  const hash = hmac.finalize();
  const signature = hash.toString(CryptoJS.enc.Base64);
  const phoneNumber = to;

  axios({
    method: method,
    json: true,
    url: url,
    headers: {
      "Content-Type": "application/json",
      "x-ncp-iam-access-key": accessKey,
      "x-ncp-apigw-timestamp": date,
      "x-ncp-apigw-signature-v2": signature,
    },
    data: {
      type: "SMS",
      contentType: "COMM",
      countryCode: "82",
      from: "01049245690",
      content: message,
      messages: [
        {
          to: phoneNumber,
        },
      ],
      reserveTime: time,
      reserveTimeZone: "Asia/Seoul",
    },
  })
    .then(function (res) {
    })
    .catch((err) => {
      console.log(err);
    });
}
