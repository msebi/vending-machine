package de.jonashackt.vendingmachine.domain;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "cash")
public class Cash {

    // PrimaryKey
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private int coinType;
    private int coinCount;

    public Cash() {
    }

    public Cash(int coinType, int coinCount) {
        this.coinType = coinType;
        this.coinCount = coinCount;
    }

    @Override
    public String toString() {
        return String.format("Cash[id=%d, cointType='%d', coinCount='%s']", id, coinType, coinCount);
    }
}
