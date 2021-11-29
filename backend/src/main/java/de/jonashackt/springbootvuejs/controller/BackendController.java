package de.jonashackt.springbootvuejs.controller;

import de.jonashackt.springbootvuejs.authentication.server.accounts.Account;
import de.jonashackt.springbootvuejs.authentication.server.accounts.AccountRole;
import de.jonashackt.springbootvuejs.authentication.server.accounts.AccountService;
import de.jonashackt.springbootvuejs.authentication.server.accounts.AccountNotFoundException;
import de.jonashackt.springbootvuejs.authentication.server.accounts.AccountRepository;
import de.jonashackt.springbootvuejs.domain.Order;
import de.jonashackt.springbootvuejs.domain.Product;
import de.jonashackt.springbootvuejs.domain.User;
import de.jonashackt.springbootvuejs.domain.StatusMsg;
import de.jonashackt.springbootvuejs.exception.ProductNotFoundException;
import de.jonashackt.springbootvuejs.exception.UserNotFoundException;
import de.jonashackt.springbootvuejs.repository.CashRepository;
import de.jonashackt.springbootvuejs.repository.ProductRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Arrays;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Controller
@RequestMapping("/api")
public class BackendController {

    public static final String HELLO_TEXT = "Hello from Spring Boot Backend!";
    public static final String SECURED_TEXT = "Hello from the secured resource!";

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    AccountService accountService;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CashRepository cashRepository;

    private Account createAccount(String email, String password, Set<AccountRole> roles) {
        return Account.builder().email(email).password(password).roles(roles).build();
    }

    private void saveIfNotExist(Account account) {
        if (accountRepository.findByEmail(account.getEmail()).isPresent()) {
            return;
        }

        accountService.saveAccount(account);
    }

    @ResponseBody
    @RequestMapping(path = "/hello")
    public String sayHello() {
        log.info("GET called on /hello resource");
        return HELLO_TEXT;
    }

    // CRUD user
    @ResponseBody
    @RequestMapping(value = "/user/create", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public StatusMsg addNewAccount(@RequestBody Account account) {
        Account savedAccount = createAccount(account.getEmail(), account.getPassword(),
                Arrays.asList(AccountRole.USER).stream().collect(Collectors.toSet()));

        saveIfNotExist(savedAccount);

        log.info(savedAccount.toString() + " successfully saved into DB; email: " + savedAccount.getEmail() + " roles: "
                + savedAccount.getRoles());

        return new StatusMsg("Created user: " + savedAccount, "SUCCESS");
    }

    @ResponseBody
    @GetMapping(path = "/user/{id}")
    @Transactional
    public Account getAccountById(@PathVariable("id") long id) {
        log.info("Reading user with id " + id + " from database.");
        return accountRepository.findById(id).map(account -> {
            log.info("Reading user with id " + id + " from database.");
            return account;
        }).orElseThrow(() -> new AccountNotFoundException(
                "The user with the id " + id + " couldn't be found in the database."));
    }

    @ResponseBody
    @DeleteMapping(path = "/user/del/{id}")
    @Transactional
    public StatusMsg deleteAccountById(@PathVariable("id") long id) {
        log.info("Deleting user with id " + id + " from database.");
        long noOfDeletedEntires = accountRepository.removeById(id);
        if (noOfDeletedEntires == 1)
            return new StatusMsg("Deleted user with id: " + id, "SUCCESS");
        else
            return new StatusMsg("Failed to delete user with id: " + id + "; user not found", "FAIL");
    }

    // CRUD product (no auth)
    @ResponseBody
    @RequestMapping(value = "/product/create", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public StatusMsg addNewProduct(@RequestBody Product product) {
        Product savedProduct = productRepository
                .save(new Product(product.getProductName(), product.getProductPrice(), product.getProductQty()));
        log.info(savedProduct.toString() + " successfully saved into DB");

        return new StatusMsg("Successfully created product: " + product, "SUCCESS");
    }

    @ResponseBody
    @GetMapping(path = "/product/{id}")
    @Transactional
    public Product getProductById(@PathVariable("id") long id) {
        return productRepository.findById(id).map(product -> {
            log.info("Reading product with id " + id + " from database.");
            return product;
        }).orElseThrow(() -> new ProductNotFoundException(
                "The product with the id " + id + " couldn't be found in the database."));
    }

    @ResponseBody
    @GetMapping(path = "/product/refill/{id}/{productQty}")
    @Transactional
    public StatusMsg refillProductById(@PathVariable("id") long id, @PathVariable("productQty") int productQty) {
        Product productRefil = productRepository.findById(id).map(product -> {
            log.info("Refilling product with id " + id + " from database.");
            product.setProductQty(productQty + product.getProductQty());
            return product;
        }).orElseThrow(() -> new ProductNotFoundException(
                "Cannot refill; the product with the id " + id + " couldn't be found in the database."));
        return new StatusMsg("Refilled product: " + productRefil, "SUCCESS");
    }

    @ResponseBody
    @DeleteMapping(path = "/product/del/{id}")
    @Transactional
    public StatusMsg deleteProductById(@PathVariable("id") long id) {
        long noOfDeletedEntires = productRepository.removeById(id);
        if (noOfDeletedEntires == 1)
            return new StatusMsg("Deleted product with id: " + id, "SUCCESS");
        else
            return new StatusMsg("Failed to delete product with id: " + id + "; product not  found", "FAIL");
    }

    // vending machine setup
    @ResponseBody
    @GetMapping(path = "/product/initialize-vending-machine")
    @Transactional
    public StatusMsg setupVendingMachineDefault() {
        VendingMachine vendingMachine = new VendingMachine(productRepository, cashRepository);
        return vendingMachine.initVendingMachineDefault();
    }

    // get order response json
    @ResponseBody
    @GetMapping(path = "/product/getorderstub")
    @Transactional
    public Order stubOrder() {
        List<Product> products = new ArrayList<>();
        products.add(new Product("snickers", 10, 10));
        products.add(new Product("fanta", 10, 10));

        Map<Integer, Integer> deposit = new HashMap<>();
        deposit.put(5, 100);
        deposit.put(10, 50);

        StatusMsg statusMsg = new StatusMsg("Sample status", "SUCCESS");

        return new Order(products, deposit, statusMsg);
    }

    @ResponseBody
    @GetMapping(path = "/product/list-products")
    @Transactional
    public List<Product> listProducts() {
        return (List<Product>) productRepository.findAll();
    }

    // purchase (no auth)
    @ResponseBody
    @RequestMapping(value = "/product/buy", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public Order buy(@RequestBody Order order) {
        VendingMachine vendingMachine = new VendingMachine(productRepository, cashRepository);
        return vendingMachine.buy(order);
    }

    @ResponseBody
    @RequestMapping(path = "/secured", method = RequestMethod.GET)
    public String getSecured() {
        log.info("GET successfully called on /secured resource");
        return SECURED_TEXT;
    }
}
