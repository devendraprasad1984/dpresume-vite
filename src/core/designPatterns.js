const designPatterns = [
  {
    category: "Creational",
    patterns: [
      {
        name: "Factory method",
        note: "Creates instances of several derived types based on input, hiding the constructors.",
        code: `
class Car { drive() { return "car"; } }
class Bike { drive() { return "bike"; } }

const vehicleFactory = (type) => {
  const map = { car: Car, bike: Bike };
  if (!map[type]) throw new Error("unknown vehicle " + type);
  return new map[type]();
};

//usage
vehicleFactory("bike").drive();
`
      },
      {
        name: "Abstract factory",
        note: "Creates whole families of related objects without naming concrete classes.",
        code: `
const lightTheme = { button: () => ({ bg: "#fff" }), input: () => ({ border: "#000" }) };
const darkTheme = { button: () => ({ bg: "#000" }), input: () => ({ border: "#fff" }) };

const uiFactory = (mode) => (mode === "dark" ? darkTheme : lightTheme);

//usage
const ui = uiFactory("dark");
ui.button();
ui.input();
`
      },
      {
        name: "Builder",
        note: "Separates construction from representation; build step by step, finish with build().",
        code: `
class RequestBuilder {
  #req = { method: "GET", headers: {} };
  method(m) { this.#req.method = m; return this; }
  header(k, v) { this.#req.headers[k] = v; return this; }
  body(b) { this.#req.body = JSON.stringify(b); return this; }
  build() { return { ...this.#req }; }
}

//usage
const req = new RequestBuilder().method("POST").header("x-id", "1").body({ a: 1 }).build();
`
      },
      {
        name: "Prototype",
        note: "Clone a fully initialised instance instead of building a new one from scratch.",
        code: `
const proto = {
  greet() { return "hi " + this.name; }
};

const user = Object.create(proto, { name: { value: "dev", writable: true } });
const clone = Object.assign(Object.create(Object.getPrototypeOf(user)), user);
const deepCopy = structuredClone({ a: { b: 1 } });

//usage
clone.greet();
`
      }
    ]
  },
  {
    category: "Structural",
    patterns: [
      {
        name: "Singleton",
        note: "One instance with a global access point, e.g. logger, context or redux store.",
        code: `
class Logger {
  static #instance;
  constructor() {
    if (Logger.#instance) return Logger.#instance;
    this.logs = [];
    Logger.#instance = this;
  }
  log(msg) { this.logs.push(msg); }
}

//usage
new Logger() === new Logger(); //true
`
      },
      {
        name: "Adapter",
        note: "Makes incompatible interfaces work together.",
        code: `
const oldApi = { getUsers: () => [["1", "dev"]] };

const userAdapter = {
  fetchUsers: () => oldApi.getUsers().map(([id, name]) => ({ id, name }))
};

//usage
userAdapter.fetchUsers();
`
      },
      {
        name: "Bridge",
        note: "Separates an abstraction from its implementation so both can vary independently.",
        code: `
const canvasRenderer = { circle: (r) => "canvas circle " + r };
const svgRenderer = { circle: (r) => "svg circle " + r };

class Circle {
  constructor(renderer, r) { this.renderer = renderer; this.r = r; }
  draw() { return this.renderer.circle(this.r); }
}

//usage
new Circle(svgRenderer, 5).draw();
`
      },
      {
        name: "Composite",
        note: "Treats single objects and groups of objects uniformly, like a tree.",
        code: `
class File {
  constructor(size) { this.size = size; }
  getSize() { return this.size; }
}
class Folder {
  constructor(...children) { this.children = children; }
  getSize() { return this.children.reduce((s, c) => s + c.getSize(), 0); }
}

//usage
new Folder(new File(10), new Folder(new File(5), new File(1))).getSize(); //16
`
      },
      {
        name: "Decorator",
        note: "Dynamically adds behaviour to an object or function without changing it.",
        code: `
const withLogging = (fn) => (...args) => {
  console.log("calling", fn.name, args);
  return fn(...args);
};

const add = (a, b) => a + b;

//usage
withLogging(add)(1, 2);
`
      },
      {
        name: "Facade",
        note: "A single simple interface hiding a complex subsystem.",
        code: `
const auth = { login: () => "token" };
const cart = { load: (t) => ["item"] };
const prices = { total: (items) => items.length * 10 };

const checkoutFacade = () => {
  const token = auth.login();
  return prices.total(cart.load(token));
};

//usage
checkoutFacade();
`
      },
      {
        name: "Flyweight",
        note: "Share fine grained objects to save memory.",
        code: `
const cache = new Map();

const getIcon = (name) => {
  if (!cache.has(name)) cache.set(name, { name, svg: "<svg/>" });
  return cache.get(name);
};

//usage
getIcon("home") === getIcon("home"); //true, one shared instance
`
      },
      {
        name: "Proxy",
        note: "A placeholder that controls access to the real object.",
        code: `
const target = { name: "dev" };

const guarded = new Proxy(target, {
  get: (obj, key) => (key in obj ? obj[key] : "n/a"),
  set: (obj, key, value) => {
    if (key === "name" && typeof value !== "string") throw new TypeError("name must be string");
    obj[key] = value;
    return true;
  }
});

//usage
guarded.age; //"n/a"
`
      }
    ]
  },
  {
    category: "Behavioural",
    patterns: [
      {
        name: "Interpreter",
        note: "Evaluate sentences of a small language by its grammar.",
        code: `
const evaluate = (expr) => {
  const [a, op, b] = expr.split(" ");
  const ops = { "+": (x, y) => x + y, "-": (x, y) => x - y, "*": (x, y) => x * y };
  return ops[op](Number(a), Number(b));
};

//usage
evaluate("3 * 4"); //12
`
      },
      {
        name: "Template method",
        note: "Defines the skeleton of an algorithm; subclasses fill in the steps.",
        code: `
class Report {
  generate() { return [this.header(), this.body(), this.footer()].join("\\n"); }
  header() { return "== report =="; }
  footer() { return "== end =="; }
  body() { throw new Error("implement body"); }
}
class SalesReport extends Report {
  body() { return "sales data"; }
}

//usage
new SalesReport().generate();
`
      },
      {
        name: "Chain of responsibility",
        note: "Pass a request along handlers until one handles it (express / redux middleware).",
        code: `
const chain = (...handlers) => (req) => {
  for (const h of handlers) {
    const res = h(req);
    if (res) return res;
  }
};

const auth = (r) => (!r.user ? "401" : null);
const admin = (r) => (r.user !== "admin" ? "403" : null);
const ok = () => "200";

//usage
chain(auth, admin, ok)({ user: "admin" });
`
      },
      {
        name: "Command",
        note: "Encapsulates a request as an object so it can be queued, logged or undone.",
        code: `
const history = [];
const run = (cmd) => { cmd.exec(); history.push(cmd); };
const undo = () => history.pop()?.undo();

let count = 0;
const increment = { exec: () => count++, undo: () => count-- };

//usage
run(increment);
undo();
`
      },
      {
        name: "Iterator",
        note: "Sequentially access a collection without knowing how it is stored.",
        code: `
class Range {
  constructor(start, end) { this.start = start; this.end = end; }
  *[Symbol.iterator]() {
    for (let i = this.start; i <= this.end; i++) yield i;
  }
}

//usage
[...new Range(1, 5)]; //[1,2,3,4,5]
`
      },
      {
        name: "Mediator",
        note: "Objects talk through a mediator instead of referring to each other.",
        code: `
class ChatRoom {
  users = new Set();
  join(user) { this.users.add(user); user.room = this; }
  send(from, msg) {
    this.users.forEach((u) => u !== from && u.receive(msg));
  }
}

//usage
const room = new ChatRoom();
room.join({ receive: console.log });
`
      },
      {
        name: "Memento",
        note: "Capture and restore an object's internal state.",
        code: `
class Editor {
  text = "";
  save() { return { text: this.text }; }
  restore(memento) { this.text = memento.text; }
}

//usage
const editor = new Editor();
editor.text = "v1";
const snapshot = editor.save();
editor.text = "v2";
editor.restore(snapshot); //back to v1
`
      },
      {
        name: "Observer",
        note: "Notify many subscribers when state changes (events, redux subscribe).",
        code: `
class Subject {
  #subs = new Set();
  subscribe(fn) { this.#subs.add(fn); return () => this.#subs.delete(fn); }
  notify(data) { this.#subs.forEach((fn) => fn(data)); }
}

//usage
const subject = new Subject();
const unsubscribe = subject.subscribe((d) => console.log("got", d));
subject.notify(1);
unsubscribe();
`
      },
      {
        name: "State",
        note: "Behaviour changes when the state changes, e.g. a reducer driving a form.",
        code: `
const states = {
  idle: { next: "loading" },
  loading: { next: "success" },
  success: { next: "idle" }
};

class Fetcher {
  state = "idle";
  next() { this.state = states[this.state].next; }
}

//usage
const f = new Fetcher();
f.next(); //loading
`
      },
      {
        name: "Strategy",
        note: "Encapsulate interchangeable algorithms and pick one at runtime.",
        code: `
const strategies = {
  ascending: (a, b) => a - b,
  descending: (a, b) => b - a
};

const sortBy = (list, type) => [...list].sort(strategies[type]);

//usage
sortBy([3, 1, 2], "descending");
`
      },
      {
        name: "Visitor",
        note: "Adds a new operation to a structure without changing its classes.",
        code: `
class Num { constructor(v) { this.v = v; } accept(visitor) { return visitor.num(this); } }
class Add { constructor(l, r) { this.l = l; this.r = r; } accept(visitor) { return visitor.add(this); } }

const evaluator = {
  num: (n) => n.v,
  add: (a) => a.l.accept(evaluator) + a.r.accept(evaluator)
};
const printer = {
  num: (n) => String(n.v),
  add: (a) => "(" + a.l.accept(printer) + " + " + a.r.accept(printer) + ")"
};

//usage
const tree = new Add(new Num(1), new Num(2));
tree.accept(evaluator); //3
tree.accept(printer); //(1 + 2)
`
      }
    ]
  }
];

export default designPatterns;
