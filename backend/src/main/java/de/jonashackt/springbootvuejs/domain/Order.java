package de.jonashackt.springbootvuejs.domain;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Order {

    private List<Product> products = new ArrayList<>();
    private Map<Integer, Integer> deposit = new HashMap<>();
    private StatusMsg statusMsg;

    public Order() {
    }

    public Order(List<Product> products, Map<Integer, Integer> deposit) {
        this.products = products;
        for (Map.Entry<Integer, Integer> entry : deposit.entrySet()) {
            this.deposit.put(entry.getKey(), entry.getValue());
        }
    }

    public Order(List<Product> products, Map<Integer, Integer> deposit, StatusMsg statusMsg) {
        this.products = products;
        this.statusMsg = statusMsg;
        for (Map.Entry<Integer, Integer> entry : deposit.entrySet()) {
            this.deposit.put(entry.getKey(), entry.getValue());
        }
    }
}
