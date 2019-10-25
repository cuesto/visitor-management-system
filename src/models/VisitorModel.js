class VisitorModel {
  constructor() {
    this.visitorKey = 0;
    this.name = "";
    this.taxNumberVisitor = "";
    this.phone = "";
    this.email = "";
    this.company = "";
    this.taxNumber = "";
    this.gender = 0;
    this.image = "";
    this.purposeKey = 0;
    this.comment = "";
    this.employeeKey = 0;
    this.startDate = new Date();
    this.endDate = new Date();
    this.employeeRequestKey = 0;
    this.status = 1;
    this.CreatedBy = "";
    this.ModifiedBy = "";
    this.Created = "";
    this.Modified = "";
  }
}

export default VisitorModel;
