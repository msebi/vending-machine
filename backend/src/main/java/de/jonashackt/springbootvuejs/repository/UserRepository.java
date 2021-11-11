package de.jonashackt.springbootvuejs.repository;

import de.jonashackt.springbootvuejs.domain.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface UserRepository extends CrudRepository<User, Long> {

    List<User> findByLastName(String lastname);

    List<User> findByFirstName(String firstname);

    Long removeById(long id);
}
