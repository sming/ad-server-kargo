class Dog {
  constructor(name) {
    this.name = name;

    // Such a shame! Can't easily make variables private easily in ES6, which IMO is a downgrade on ES5. Ref: http://stackoverflow.com/questions/22156326/private-properties-in-javascript-es6-classes
    this.phasBarked = false;
  }

  bark() {
    this.phasBarked = true;
    return `WOOF, I am ${this.name}`;
  }

  hasBarked() {
    return this.phasBarked;
  }
}

export default Dog;
