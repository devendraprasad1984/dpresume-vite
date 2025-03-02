const codeBlocks = {
  createObjectVanilla: () => {
    return `
      const newObject = {};
      const newObject = Object.create(Object.prototype);
      const newObject = new Object();
      newObject.someKey="Hello World";
      newObject["someKey1"]="Hello World";
      var key = newObject.someKey;
      var key1 = newObject["someKey1"];
      //eg. person object creation
      const person = Object(null);
      defineProps(person, "car", "delorean");
      defineProps(person, "dob", "xx-xx-xxxx");
      defineProps(person, "hasBeard", "true");
      //drive is a person
      const driver = Object.create(person);
      defineProp(driver,"topSpead", "100mph");
      console.log("driver is old", driver.dob);
      console.log("driver is running at", driver.topSpeed);
    `;
  },
  createObjectClass: () => {
    return `
      class car{
        constructor(model, year, miles){
          this.model = model;
          this.year = year;
          this.miles = miles;
        }
        //defining any method here will be associated with all objects created with this class
        //to have some global generic method on all objects but defined once, will go with prototype inheritance
      }
      car.prototype.toString=function(){
        return "this.model has done this.miles"
      }
      //usage
      console.log(new car("Honda Civic", 2009, 20000).toString());
      console.log(new car("Ford Mondeo", 2010, 10000).toString());
    `;
  },
  ModuleExample: () => {
    return `
      //Module pattern: Object literals, private vars/functions are namespaced into testModules
      let counter=0; //private variable;
      let items=[];
      const log=val=>console.log(val); //private function
      const testModule={
        prop1:"prop1", //this is public variable
        incrementCounter(){
        counter++;
          log("incremented - "+counter);
        },
        resetCounter:()=>{counter=0;},
        addItem:(values)=>{
        items.push(values);
        },
        getItemCount:()=>items.length;,
        getTotal:()=>items.reduce((sum, item)=>sum+item?.price, 0)
      }
      export default testModule;
      //usage
      import testModule from "./testModule.js"; //this can come from https also, just need module exposed
      testModule.incrementCounter();
      testModule.addItem({item: "bread", price: 10});
      testModule.addItem({item: "butter", price: 15});
      console.log(testModule.getItemCount(), testModule.getTotal())
    `;
  }

};
export default codeBlocks;