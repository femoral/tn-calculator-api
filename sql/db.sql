create user calculator with password 'localpassword';

create extension if not exists "uuid-ossp" ;

create type operation_status_enum as enum ('ENABLED', 'DISABLED');

alter type operation_status_enum owner to calculator;

create type operation_type_enum as enum ('ADDITION', 'SUBTRACTION', 'MULTIPLICATION', 'DIVISION', 'SQUARE_ROOT', 'RANDOM_STRING');

alter type operation_type_enum owner to calculator;

create type user_status_enum as enum ('ENABLED', 'DISABLED');

alter type user_status_enum owner to calculator;

create table operation
(
    id       integer generated always as identity,
    cost     numeric(12, 2)                 not null,
    type     operation_type_enum not null,
    operands smallint                       not null
);

alter table operation
    owner to calculator;

grant select, usage on sequence operation_id_seq to calculator;

grant delete, insert, select, update on operation to calculator;

create table record
(
    id                 integer generated always as identity,
    operation_id       integer                                                    not null,
    user_id            uuid                                                       not null,
    amount             numeric(12, 2)                                             not null,
    user_balance       numeric(12, 2)                                             not null,
    operation_response text                                                       not null,
    date               timestamp with time zone         default CURRENT_TIMESTAMP not null,
    status             operation_status_enum default 'ENABLED'::operation_status_enum
);

alter table record
    owner to calculator;

grant select, usage on sequence record_id_seq to calculator;

grant delete, insert, select, update on record to calculator;

create table "user"
(
    id       uuid                        default uuid_generate_v4()          not null,
    username varchar(256)                                                               not null,
    password text                                                                       not null,
    status   user_status_enum default 'ENABLED'::user_status_enum not null,
    balance  numeric(12, 2)                                                             not null
);

alter table "user"
    owner to calculator;

grant delete, insert, select, update on "user" to calculator;

insert into operation (cost, type, operands) values (6.66, 'RANDOM_STRING', 0);
insert into operation (cost, type, operands) values (5.55, 'SQUARE_ROOT', 1);
insert into operation (cost, type, operands) values (2.22, 'DIVISION', 2);
insert into operation (cost, type, operands) values (3.33, 'MULTIPLICATION', 2);
insert into operation (cost, type, operands) values (4.44, 'SUBTRACTION', 2);
insert into operation (cost, type, operands) values (1.11, 'ADDITION', 2);

SELECT pg_catalog.setval('operation_id_seq', 6, true);

alter table only operation
    add constraint operation_pk primary key (id);

alter table only operation
    add constraint operation_type_unique unique (type);

alter table only record
    add constraint record_pk primary key (id);

alter table only "user"
    add constraint user_pk primary key (id);

alter table only "user"
    add constraint user_username_unique unique (username);

create index record_user_id_status_index on record using btree (user_id, status);

alter table only record
    add constraint record_operation_id_fk foreign key (operation_id) references operation(id);

alter table only record
    add constraint record_user_id_fk foreign key (user_id) references "user"(id);


