-- create table town(
--     id serial not null primary key,
--     regNumber text not null,
--     townName text not null 
-- );
-- create table registrations(
--     id serial not null primary key,
--     reg text not null,
--     townId int not null,
--     foreign key (townId) references town(id)
-- );


-- INSERT INTO town (regNumber, townName) VALUES ('CJ', 'Paarl');
-- INSERT INTO town (regNumber, townName) VALUES ('CY', 'Bellville');
-- INSERT INTO town (regNumber, townName) VALUES ('CA', 'Cape Town');

create table towns (
id serial not null primary key,
town_name text not null,
town_tag text not null
);

CREATE TABLE registrationNo(
 id serial not null primary key,
 reg_number text not null,
 town int not null,
  foreign key (town) references towns(id)
);




insert into towns(town_name,town_tag) values ('Cape Town','CA');
insert into towns(town_name,town_tag) values ('Bellville','CY');
insert into towns(town_name,town_tag) values ('Paarl','CJ');