create table admins
(
    id int auto_increment
        primary key,
    name varchar(200) null,
    icon varchar(1000) null,
    password varchar(50) null,
    email varchar(500) null
);

create table adrotator
(
    id int auto_increment
        primary key,
    description text null,
    about varchar(1000) null,
    type varchar(50) null,
    placeOnApp varchar(50) null,
    link varchar(1000) null,
    offertype int null
);

create table agenttype
(
    id int auto_increment
        primary key,
    type varchar(100) null
);

create table appusage
(
    id int auto_increment
        primary key,
    usedon datetime null,
    usedby varchar(50) null,
    loc varchar(200) null
);

create table company
(
    id int auto_increment
        primary key,
    name varchar(200) null,
    address varchar(1000) null,
    country varchar(100) null,
    zip varchar(15) null,
    regnum varchar(100) null,
    remarks varchar(300) null
);

create table config
(
    `key` varchar(100) null,
    value text null,
    helperText varchar(500) null
);

create table dealers
(
    id int auto_increment
        primary key,
    agentid varchar(50) null,
    name varchar(300) null,
    address varchar(1000) null,
    pincode varchar(50) null,
    city varchar(100) null,
    country varchar(100) null,
    guid varchar(20) null,
    email varchar(500) null,
    type varchar(50) default 'agent' null,
    mobile varchar(50) default '910000000000' null,
    companyid int null,
    deliveryboyid int default -1 null,
    constraint dealers_pk
        unique (guid)
);

create table deliveryboys
(
    id int default 0 not null
        primary key,
    name varchar(200) default '<none>' null,
    address text null,
    mobile varchar(20) null,
    icon varchar(500) null
);

create table error_log
(
    log_id int auto_increment
        primary key,
    error_message longtext not null,
    error_file longtext not null,
    error_line longtext not null,
    error_trace longtext not null,
    error_log_date datetime default CURRENT_TIMESTAMP null
);

create table fileuploads
(
    id bigint auto_increment
        primary key,
    file varchar(1000) null,
    size bigint null,
    type varchar(100) null,
    loc text null,
    absloc text null,
    tags varchar(1000) null
);

create table helpscreens
(
    id int auto_increment
        primary key,
    bgcolor varchar(20) default 'black' null,
    image varchar(1000) null,
    title varchar(255) null,
    subtitle varchar(500) null,
    link varchar(500) null,
    screen varchar(100) null
);

create table icons
(
    id int auto_increment
        primary key,
    category varchar(100) null,
    icons varchar(1000) null,
    screen varchar(100) null,
    type int default 1 null
);

create table invoice
(
    id bigint auto_increment
        primary key,
    orderid bigint null,
    amount float null,
    taxes float null,
    discount float null,
    finalAmount float null,
    createdon datetime null,
    biller varchar(100) null,
    agentid varchar(50) null
);

create table miscorders
(
    id bigint auto_increment
        primary key,
    agentid int null,
    orderItems text null,
    tax float default 0 null,
    date datetime default CURRENT_TIMESTAMP null,
    state varchar(100) default 'pending' null,
    shippedon datetime null,
    shippedby varchar(200) default '' null,
    expectedby datetime null,
    deliveryby int default 0 null,
    ordervalue float default 0 null,
    remarks varchar(500) null,
    gst float default 0 null,
    paymentmode varchar(30) default '' null,
    payremarks varchar(100) default '' null,
    ispaid int default 0 null,
    extrainfo varchar(255) default '' null,
    prefix varchar(5) default 'M' null,
    handovercode varchar(10) default '0' null,
    isdelivered int default 0 null,
    ordertype varchar(10) default 'misc' null
);

create table offers
(
    id int auto_increment
        primary key,
    type varchar(100) null,
    active int null,
    agentid bigint null,
    link varchar(1000) null,
    information text null,
    description varchar(1000) null,
    about varchar(255) null
);

create table orderimages
(
    id bigint auto_increment
        primary key,
    orderid bigint null,
    uri varchar(1000) null
);

create table orders
(
    id bigint auto_increment
        primary key,
    agentid int null,
    tax float default 0 null,
    date datetime default CURRENT_TIMESTAMP null,
    state varchar(100) default 'pending' null,
    shippedon datetime null,
    shippedby varchar(200) default '' null,
    expectedby datetime null,
    deliveryby int default 0 null,
    ordervalue float default 0 null,
    remarks varchar(500) default '' null,
    gst float default 0 null,
    paymentmode varchar(30) default '' null,
    payremarks varchar(100) default '' null,
    ispaid int default 0 null,
    extrainfo varchar(255) default '' null,
    prefix varchar(5) default 'A' null,
    handovercode varchar(10) default '0' null,
    isdelivered int default 0 null
);

create table orderitems
(
    id bigint auto_increment
        primary key,
    prodid int null,
    orderid bigint null,
    amount float null,
    tax float null,
    discount float null,
    price float null,
    qty int null,
    createdon datetime default CURRENT_TIMESTAMP null,
    calcline varchar(255) null,
    constraint orderitems_orders_id_fk
        foreign key (orderid) references orders (id)
            on update cascade on delete cascade
);

create table products
(
    id bigint auto_increment
        primary key,
    name varchar(300) null,
    type bigint null,
    price float null,
    tax float null,
    createOn datetime null,
    discount float null,
    description varchar(1000) null
);

create table product_images
(
    id int auto_increment
        primary key,
    productid bigint null,
    uri varchar(1000) null,
    type varchar(50) null,
    constraint product_images_products_id_fk
        foreign key (productid) references products (id)
            on update cascade on delete cascade
);

create table statuscodes
(
    id int auto_increment
        primary key,
    status varchar(100) null
);

create table supportqueries
(
    id int auto_increment
        primary key,
    name varchar(100) null,
    mobile bigint null,
    email varchar(255) null,
    query varchar(1000) null,
    isreplied int default 0 null,
    agentid bigint null,
    createdon datetime default CURRENT_TIMESTAMP null
);

create table supportreplies
(
    id int auto_increment
        primary key,
    supportid int null,
    reply varchar(1000) null,
    repliedOn datetime null
);

create table taxes
(
    id bigint auto_increment
        primary key,
    name varchar(100) null,
    value float null,
    isActive int null,
    createOn datetime null
);

create table types
(
    id bigint auto_increment
        primary key,
    name varchar(100) null,
    createOn datetime null
);

