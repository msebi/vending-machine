package de.jonashackt.vendingmachine.repository;

import org.springframework.data.repository.CrudRepository;

import de.jonashackt.vendingmachine.domain.Cash;

import java.util.List;

public interface CashRepository extends CrudRepository<Cash, Long> {

    List<Cash> findByCoinType(int coinType);

    List<Cash> findByCoinCount(int coinCount);
}