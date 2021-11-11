package de.jonashackt.springbootvuejs.repository;

import de.jonashackt.springbootvuejs.domain.Cash;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CashRepository extends CrudRepository<Cash, Long> {

    List<Cash> findByCoinType(int coinType);

    List<Cash> findByCoinCount(int coinCount);
}