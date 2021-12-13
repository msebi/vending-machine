package mvp.match.vendingmachine.repository;

import org.springframework.data.repository.CrudRepository;

import mvp.match.vendingmachine.domain.Product;

import java.util.List;

public interface ProductRepository extends CrudRepository<Product, Long> {

    List<Product> findByProductName(String productName);

    List<Product> findByProductPrice(float productPrice);

    List<Product> findByProductQty(long productQty);

    Long removeById(long id);
}
