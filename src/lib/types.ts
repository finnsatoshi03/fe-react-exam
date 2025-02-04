export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  hireDate: string;
  employmentType: string;
  salary: number;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
}

export interface TimeRecord {
  id: number;
  employeeId: number;
  date: string;
  timeIns: {
    timeIn: string;
    timeOut: string;
    type: string;
  }[];
  totalWorkHours: number;
  status: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
