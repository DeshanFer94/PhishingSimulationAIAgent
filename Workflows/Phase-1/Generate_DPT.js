const departments = ["Finance","HR","IT","Marketing"];

return departments.map(dep => ({
  json: {
    department: dep
  }
}));
