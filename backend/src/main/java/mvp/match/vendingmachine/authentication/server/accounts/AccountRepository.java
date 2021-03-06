package mvp.match.vendingmachine.authentication.server.accounts;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByEmail(String username);

    Long removeById(long id);
}
