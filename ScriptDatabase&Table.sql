-- -----------------------------------------------------
-- Schema coffe
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `coffe` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `coffe` ;

-- -----------------------------------------------------
-- Table `coffe`.`ingredientes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coffe`.`ingredientes` (
  `id_Ingrediente` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `quantidade` INT NOT NULL,
  `unidade_medida` ENUM('KG', 'LITROS', 'UNIDADE', 'PACOTE') NOT NULL,
  `fornecedor` VARCHAR(255) NOT NULL,
  `ponto_pedido` INT NOT NULL,
  `preco_custo` DECIMAL(10,2) NOT NULL,
  `localizacao` ENUM('ARMÁRIO', 'GELADEIRA', 'FRIZZER') NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_Ingrediente`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
COMMENT = '							';