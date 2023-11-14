import DriverLicense from "../dto/license.js";
import axios from 'axios';
import { JSDOM } from 'jsdom';

function validateResult(isSuccess, validate){
    this.isSuccess = isSuccess
    this.validationResult = validate
}

const safeDrivingUrl = "https://www.safedriving.or.kr/LnrForRtnLicns/LnrForRtnLicnsTruthYnComplete.do"

function LicenseDataToFormData(driverLicense){
    let formData = new URLSearchParams();

    formData.append('menuCode','MN-PO-1241')
    formData.append('licenLocal',driverLicense.licenLocal)
    formData.append('sName',driverLicense.name)
    formData.append('sJumin1', driverLicense.birthday)
    formData.append('licence01', driverLicense.licence01)
    formData.append('licence02', driverLicense.licence02)
    formData.append('licence03', driverLicense.licence03)
    formData.append('licence04', driverLicense.licence04)
    formData.append('serialNum', driverLicense.serialNum)

    let ret = []

    for(let [k, v] of formData.entries()){
        ret.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    }

    return ret.join('&');
}

export default async function checkLicense(driverLicense){
    let res = await axios({
        method:"POST",
        url:safeDrivingUrl,
        data:LicenseDataToFormData(driverLicense)
    })

    const responseHtml = new JSDOM(res.data);
    const licenseIsValid = responseHtml.window.document.querySelector(
        '.contents > .ul_list > li:nth-child(2)').innerHTML === '도로교통공단 전산 자료와 일치합니다.';
    const serialNumberMatched = responseHtml.window.document.querySelector(
        '.contents > .ul_list > li:nth-child(1)').innerHTML === '암호일련번호가 일치합니다.';

    if(licenseIsValid && serialNumberMatched){
        return new validateResult(true, "VALID");
    }

    return new validateResult(false, "INVALID");
}

