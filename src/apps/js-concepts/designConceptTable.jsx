import React from "react";

const DesignConceptTable = () => {
  return <div className="col gap10">
    <div className="bold size18">Design patterns are broadly classified into 3 categories viz creational, structural,
      behavioural
    </div>
    <div className="">
      <div className="bold">Creational Design Pattern</div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Factory method</span>
        <span>Makes an instance of several derived classes based on interfaced data or events</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Abstract factory</span>
        <span>creates an instance of several families of classes without detailing concrete classes</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Builder</span>
        <span>Separates object construction from its representations; always creates the same type of objects</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Prototype</span>
        <span>fully initialised instance used for copying or cloning</span>
      </div>
    </div>

    <div className="">
      <div className="bold">Structural Design Pattern</div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Singleton</span>
        <span>A class with only single instance with global access points, gloabl data sharing object eg logger / context object / redux global state</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Adapter</span>
        <span>matches interfaces of different classes so that classes can work together despite incompatible interfaces</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Bridge</span>
        <span>Separates an objects interface from its implementation so that the two can vary independently</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Composite</span>
        <span>A structure of simple and composite objects that makes the total object more that just the sum of its parts</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Decorator</span>
        <span>Dynamically adds alternate processing of objects</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Facade</span>
        <span>A single class that hides the complexity of an entire ecosystem</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Flyweight</span>
        <span>A fine grained instance used for efficient sharing of information that is contained elsewhere</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Proxy</span>
        <span>A placeholder object representing the true object</span>
      </div>
    </div>

    <div className="">
      <div className="bold">Behavioural Design Pattern</div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Interpreter</span>
        <span>A way to include language elements in an application to match the grammar of the intended language</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Template method</span>
        <span>Creates the shell of an algorithm in a method, then defers the exact steps to a subclass</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Chain of responsibility</span>
        <span>A way of passing a request between a chain of objects to find the object that can handle the request</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Command</span>
        <span>A way to separate the execution of a command from its invoker</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Iterator</span>
        <span>sequentially access the elements of a collection without knowing the inner working of the collection eg GenericList(T)</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Mediator</span>
        <span>defines simplified communications between classes to prevent a group of classes from referring explicitly to each other</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Memento</span>
        <span>captures an objects internal state to be able to restore it later</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Observer</span>
        <span>A way of notifying change to number of classes to ensure consistency between the classes</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">State</span>
        <span>Alters an objects behaviour when its state changes, eg form depending on state of a reducer triggering middleware</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Strategy</span>
        <span>Encapsulates an algo inside a class, separating the selection from its implementation</span>
      </div>
      <div className="row mcol">
        <span className="wid150px text-primary mcol bold">Visitor</span>
        <span>Adds a new operation to a class without changing the class</span>
      </div>
    </div>
  </div>;
};
export default DesignConceptTable;