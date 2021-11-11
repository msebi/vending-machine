package de.jonashackt.springbootvuejs.domain;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "products")
public class Product {

    // PrimaryKey
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String productName;
    private int productPrice;
    private int productQty;

    protected Product() {
    }

    public Product(String productName, int productPrice, int productQty) {
        this.productName = productName;
        this.productPrice = productPrice;
        this.productQty = productQty;
    }

    @Override
    public String toString() {
        return String.format("Product[id=%d, productName='%s', productPrice='%d', productQty='%d']", id, productName,
                productPrice, productQty);
    }
}
