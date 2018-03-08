export class BookingRoom {
    unitTypeId:number = 0;
    unitTypeName: string = '';
    desc: string = '';
    picUrl: string = '';
    totalRate : number = 0;
    rateUSD:number = 0;
    rateYEN:number = 0;
    rateIDR:number = 0;
    status: number = 0;
    listImages:string[] = Array();

    constructor(_unitTypeId:number = 0, _unitTypeName: string = "", _desc: string = "", _picUrl : string="",
        _rateUSD:number = 0, _rateYEN: number = 0, _rateIDR : number = 0, _totalRate : number = 0, _status : number = 0) {
        this.unitTypeId = _unitTypeId;
        this.unitTypeName = _unitTypeName;
        this.desc = _desc || '';
        this.picUrl = _picUrl || '';
        this.rateUSD = _rateUSD;
        this.rateYEN = _rateYEN;
        this.rateIDR = _rateIDR;
        this.totalRate = _totalRate;
        this.status = _status;
    }   
}
