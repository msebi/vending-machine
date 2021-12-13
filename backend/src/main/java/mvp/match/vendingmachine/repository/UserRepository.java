package mvp.match.vendingmachine.repository;

import org.springframework.data.repository.CrudRepository;

import mvp.match.vendingmachine.domain.User;

import java.util.List;

public interface UserRepository extends CrudRepository<User, Long> {

    List<User> findByLastName(String lastname);

    List<User> findByFirstName(String firstname);

    Long removeById(long id);
}
