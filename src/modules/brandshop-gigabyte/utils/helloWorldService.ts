import IServiceInterface from "../../utils/IServiceInterface";

class HelloWorldService implements IServiceInterface {
  createRecord(...args: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  updateRecord(...args: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  deleteRecord(...args: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getRecord(...args: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}