export default class DriverLicense{
    constructor(name, birthday, licenseNumber, serialNum){
        this.name = name;
        this.birthday = birthday;
        this.licenLocal = licenseNumber.split('-')[0];
        this.licence01 = licenseNumber.split('-')[0];
        this.licence02 = licenseNumber.split('-')[1];
        this.licence03 = licenseNumber.split('-')[2];
        this.licence04 = licenseNumber.split('-')[3];
        this.serialNum = serialNum;
    }
}

