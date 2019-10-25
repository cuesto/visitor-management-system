class EmployeeRequestModel {
  constructor() {
    this.employeeRequestKey = 0;
    this.employeeKey = 0;
    this.visitorName = "";
    this.visitorEmail = "";
    this.visitorPhone = "";
    this.taxNumber = "";
    this.company = "";
    this.purposeKey = 0;
    this.startDate = "";
    this.startTime = null;
    this.endDate = "";
    this.endTime = null;
    this.comments = "";
    this.status = 0;
    this.employeeName = "";
    this.purposeDescription = "";
    this.daysList = "";
    this.CreatedBy = "";
    this.ModifiedBy = "";
    this.Created = "";
    this.Modified = "";
  }
}

export default EmployeeRequestModel;