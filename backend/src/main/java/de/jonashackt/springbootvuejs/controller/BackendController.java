package de.jonashackt.springbootvuejs.controller;

import de.jonashackt.springbootvuejs.domain.Order;
import de.jonashackt.springbootvuejs.domain.Product;
import de.jonashackt.springbootvuejs.domain.User;
import de.jonashackt.springbootvuejs.domain.StatusMsg;
import de.jonashackt.springbootvuejs.exception.ProductNotFoundException;
import de.jonashackt.springbootvuejs.exception.UserNotFoundException;
import de.jonashackt.springbootvuejs.repository.CashRepository;
import de.jonashackt.springbootvuejs.repository.ProductRepository;
import de.jonashackt.springbootvuejs.repository.UserRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api")
public class BackendController {

    private static final Logger LOG = LoggerFactory.getLogger(BackendController.class);

    public static final String HELLO_TEXT = "Hello from Spring Boot Backend!";
    public static final String SECURED_TEXT = "Hello from the secured resource!";

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CashRepository cashRepository;

    @ResponseBody
    @RequestMapping(path = "/hello")
    public String sayHello() {
        LOG.info("GET called on /hello resource");
        return HELLO_TEXT;
    }

    // CRUD user
    @ResponseBody
    @RequestMapping(value = "/user/create", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public User addNewUser(@RequestBody User user) {
        User savedUser = userRepository.save(new User(user.getFirstName(), user.getLastName()));
        LOG.info(savedUser.toString() + " successfully saved into DB; firstName: " + savedUser.getFirstName()
                + " lastName: " + savedUser.getLastName());
        return savedUser;
    }

    @ResponseBody
    @GetMapping(path = "/user/{id}")
    @Transactional
    public User getUserById(@PathVariable("id") long id) {
        LOG.info("Reading user with id " + id + " from database.");
        return userRepository.findById(id).map(user -> {
            LOG.info("Reading user with id " + id + " from database.");
            return user;
        }).orElseThrow(
                () -> new UserNotFoundException("The user with the id " + id + " couldn't be found in the database."));
    }

    @ResponseBody
    @DeleteMapping(path = "/user/del/{id}")
    @Transactional
    public StatusMsg deleteUserById(@PathVariable("id") long id) {
        LOG.info("Deleting user with id " + id + " from database.");
        long noOfDeletedEntires = userRepository.removeById(id);
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
    public Product addNewProduct(@RequestBody Product product) {
        Product savedProduct = productRepository
                .save(new Product(product.getProductName(), product.getProductPrice(), product.getProductQty()));
        LOG.info(savedProduct.toString() + " successfully saved into DB");
        return savedProduct;
    }

    @ResponseBody
    @GetMapping(path = "/product/{id}")
    @Transactional
    public Product getProductById(@PathVariable("id") long id) {
        return productRepository.findById(id).map(product -> {
            LOG.info("Reading product with id " + id + " from database.");
            return product;
        }).orElseThrow(() -> new ProductNotFoundException(
                "The product with the id " + id + " couldn't be found in the database."));
    }

    @ResponseBody
    @GetMapping(path = "/product/refill/{id}/{productQty}")
    @Transactional
    public Product refillProductById(@PathVariable("id") long id, @PathVariable("productQty") int productQty) {
        return productRepository.findById(id).map(product -> {
            LOG.info("Refilling product with id " + id + " from database.");
            product.setProductQty(productQty + product.getProductQty());
            return product;
        }).orElseThrow(() -> new ProductNotFoundException(
                "Cannot refill; the product with the id " + id + " couldn't be found in the database."));
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
    @RequestMapping(value = "/product/purchase", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public Order makePurchase(@RequestBody Order order) {
        VendingMachine vendingMachine = new VendingMachine(productRepository, cashRepository);
        return vendingMachine.purchase(order);
    }

    @ResponseBody
    @RequestMapping(path = "/secured", method = RequestMethod.GET)
    public String getSecured() {
        LOG.info("GET successfully called on /secured resource");
        return SECURED_TEXT;
    }
}
