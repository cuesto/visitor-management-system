class UserModel {
  constructor() {
    this.userKey = 0;
    this.name = "";
    this.roleKey = 0;
    this.email = "";
    this.password = "";
    this.isNewPassword = false;
    this.password_hash = "";
    this.password_salt = "";
    this.CreatedBy = "";
    this.ModifiedBy = "";
    this.Created="";
    this.Modified="";
  }
}

export default UserModel;
