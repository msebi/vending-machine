package de.jonashackt.vendingmachine.repository;

import org.springframework.data.repository.CrudRepository;

import de.jonashackt.vendingmachine.domain.User;

import java.util.List;

public interface UserRepository extends CrudRepository<User, Long> {

    List<User> findByLastName(String lastname);

    List<User> findByFirstName(String firstname);

    Long removeById(long id);
}
