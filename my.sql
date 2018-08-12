CREATE DATABASE 	bamazon;
USE bamazon;

CREATE TABLE products(
id INTEGER NOT NULL AUTO_INCREMENT,
product_name VARCHAR (30) NOT NULL,
department_name VARCHAR (50) NOT NULL,
price DECIMAL (12,2) NOT NULL,
quantity  INTEGER (50) NOT NULL,
PRIMARY KEY (id)
);

INSERT INTO products(product_name, department_name, price, quantity)
VALUES ("Pac-Man","Games",12.50,200),
("Donkey Kong","Games",15.25,250),
("Mario Bros.","Games",23.50,1000),
("Space Invaders","Games",1.25,245),
("Burton Snowboard","Outdoor",350.45,29),
("Smith Gloves","Outdoor",69.33,70),
("Lamborghini Diablo","Transportation",349049.99,3),
("M1 Abrams Tank","Transportation",950456.03,55),
("AH-64 Apache","Transportation",2112466.89,77),
("Sims Boots","Outdoor",295.44,301);



