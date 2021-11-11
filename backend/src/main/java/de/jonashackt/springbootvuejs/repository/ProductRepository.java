package de.jonashackt.springbootvuejs.repository;

import de.jonashackt.springbootvuejs.domain.Product;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ProductRepository extends CrudRepository<Product, Long> {

    List<Product> findByProductName(String productName);

    List<Product> findByProductPrice(float productPrice);

    List<Product> findByProductQty(long productQty);

    Long removeById(long id);
}
