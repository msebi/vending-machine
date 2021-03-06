package mvp.match.vendingmachine.repository;

import org.springframework.data.repository.CrudRepository;

import mvp.match.vendingmachine.domain.Cash;

import java.util.List;

public interface CashRepository extends CrudRepository<Cash, Long> {

    List<Cash> findByCoinType(int coinType);

    List<Cash> findByCoinCount(int coinCount);
}