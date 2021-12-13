package mvp.match.vendingmachine.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import mvp.match.vendingmachine.domain.Cash;
import mvp.match.vendingmachine.domain.Order;
import mvp.match.vendingmachine.domain.Product;
import mvp.match.vendingmachine.domain.StatusMsg;
import mvp.match.vendingmachine.exception.ProductNotFoundException;
import mvp.match.vendingmachine.repository.CashRepository;
import mvp.match.vendingmachine.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class VendingMachine {
    /*
     * Vending machine logic;
     *
     * 1. Setup
     *
     * -- the vending machine has slots for each type of coin (hash map) -- prices
     * are given in the smallest unit (there are no banknotes, only coins, for
     * example a product that costs 100 cents costs 100 cents and not a dollar => no
     * fractional values) -- the vending machine may or may not have coins in it
     * when the api launches (start of day, initial supply) -- the vending machine
     * may or may not have been stocked with products -- the vending machine always
     * returns change; if there is no exact change, returns deposited cash back to
     * user, clears shopping session -- there is no upper limit on products it can
     * store (neither types nor quantity of product) -- no upper limit on cash --
     * the vending machine can be refilled (product by product, or batches of
     * different products) -- the vending machine's revenue can be fetched -- one
     * session per user; if a user deposits cash and leaves the machine, the next
     * user to use the machine will start with a new session (no access to previous
     * deposit) -- there's a possibility for race conditions; if one user buys an
     * item to which the machine has enough change and another buys an item for
     * which the machine also has change but after the first user finishes, the
     * machine can no longer return exact change; one user will get a return of
     * their deposit and no product(s) (transactions are ACID) -- same applies if
     * the machine is either restocked or has its cash replenished -- cash has to be
     * initialized even if empty (coins of each type must be present) -- no engross
     * support (more items less than 5 cents) -- security to be added later
     *
     * 2. Flow
     *
     * 1) User deposits coins 2) Picks products 3) Hits purchase 4) The vending
     * achine checks if product is present, if not returns deposit/notify user 5) If
     * product(s) is(are) present the vending machine checks quantity, if not enough
     * products return deposit/notify user 6) Vending machine checks user deposit,
     * if not enough returns deposit/notify user 7) If deposit is enough, checks if
     * it can return exact change, if not return deposit/notify user 8) All's good,
     * return products and change 8*) The vending machine tries to return change in
     * highest amounts of coin (e.g. 25 cents as change would be 1 x 20 cents + 1 x
     * 5 cents rather than 5 x 5 cents (if the cash deposit allows it) 9) Deposit is
     * stored to the cash
     */

    private final int CENTS_5 = 5;
    private final int CENTS_10 = 10;
    private final int CENTS_20 = 20;
    private final int CENTS_50 = 50;
    private final int CENTS_100 = 100;

    private Map<Integer, Integer> deposit = new HashMap<Integer, Integer>();
    private Map<Integer, Integer> cash = new HashMap<Integer, Integer>();

    private ArrayList<Product> products = new ArrayList<Product>();

    private CashRepository cashRepository;
    private ProductRepository productRepository;

    public VendingMachine(ProductRepository productRepository, CashRepository cashRepository) {
        this.productRepository = productRepository;
        this.cashRepository = cashRepository;
    }

    private StatusMsg initProduct(Product defaultProduct) {
        List<Product> initProduct = productRepository.findByProductName(defaultProduct.getProductName());

        if (initProduct.size() > 1)
            return new StatusMsg(
                    "Cannot have duplicate entries for the same product: " + defaultProduct.getProductName(), "FAILED");
        else if (initProduct.size() == 1) {
            Optional<Object> result = productRepository.findById(initProduct.get(0).getId()).map(product -> {
                log.info("Restocking product with name " + initProduct.get(0).getProductName() + " from database.");
                product.setProductPrice(defaultProduct.getProductPrice());
                product.setProductQty(defaultProduct.getProductQty());
                return product;
            });

            if (result.isPresent())
                return new StatusMsg("Initialized product: " + defaultProduct.getProductName(), "SUCCESS");
            else
                return new StatusMsg("Failed to initialize product: " + defaultProduct.getProductName(), "FAILED");
        } else {
            productRepository.save(new Product(defaultProduct.getProductName(), defaultProduct.getProductPrice(),
                    defaultProduct.getProductQty()));
            return new StatusMsg("Initialized product: " + defaultProduct.getProductName(), "SUCCESS");
        }
    }

    private StatusMsg initCash(Cash cash) {
        List<Cash> initCash = cashRepository.findByCoinType(cash.getCoinType());
        if (initCash.size() > 1)
            return new StatusMsg("Cannot have duplicate entries for the same coin type: " + cash.getCoinType(),
                    "FAILED");
        else if (initCash.size() == 1) {
            Optional<Object> result = cashRepository.findById(initCash.get(0).getId()).map(cashIt -> {
                log.info("Restocking coins of type " + cashIt.getCoinType() + " from database.");
                cashIt.setCoinCount(cash.getCoinCount());
                return new StatusMsg("Initialized coins type: " + cashIt.getCoinType(), "SUCCESS");
            });

            if (result.isPresent())
                return new StatusMsg("Initialized cash: " + cash.getCoinType(), "SUCCESS");
            else
                return new StatusMsg("Failed to initialize cash: " + cash.getCoinType(), "FAILED");
        } else {
            cashRepository.save(new Cash(cash.getCoinType(), cash.getCoinType()));
            return new StatusMsg("Initialized coins type: " + cash.getCoinType(), "SUCCESS");
        }
    }

    // test only
    public StatusMsg initVendingMachineDefault() {
        log.info("Initializing vending machine default ... ");
        StatusMsg statusMsg = null;

        statusMsg = initProduct(new Product("snickers", 50, 10));
        if (statusMsg.getStatus().equalsIgnoreCase("FAILED"))
            return statusMsg;

        statusMsg = initProduct(new Product("cola", 125, 5));
        if (statusMsg.getStatus().equalsIgnoreCase("FAILED"))
            return statusMsg;

        statusMsg = initProduct(new Product("fanta", 115, 10));
        if (statusMsg.getStatus().equalsIgnoreCase("FAILED"))
            return statusMsg;

        statusMsg = initProduct(new Product("water", 75, 5));
        if (statusMsg.getStatus().equalsIgnoreCase("FAILED"))
            return statusMsg;

        statusMsg = initProduct(new Product("bubble gum", 1, 20));
        if (statusMsg.getStatus().equalsIgnoreCase("FAILED"))
            return statusMsg;

        statusMsg = initProduct(new Product("sticker", 2, 100));
        if (statusMsg.getStatus().equalsIgnoreCase("FAILED"))
            return statusMsg;

        statusMsg = initCash(new Cash(CENTS_5, 100));
        if (statusMsg.getStatus().equalsIgnoreCase("FAILED"))
            return statusMsg;

        statusMsg = initCash(new Cash(CENTS_10, 50));
        if (statusMsg.getStatus().equalsIgnoreCase("FAILED"))
            return statusMsg;

        statusMsg = initCash(new Cash(CENTS_20, 40));
        if (statusMsg.getStatus().equalsIgnoreCase("FAILED"))
            return statusMsg;

        statusMsg = initCash(new Cash(CENTS_50, 50));
        if (statusMsg.getStatus().equalsIgnoreCase("FAILED"))
            return statusMsg;

        statusMsg = initCash(new Cash(CENTS_100, 50));
        if (statusMsg.getStatus().equalsIgnoreCase("FAILED"))
            return statusMsg;

        return new StatusMsg("Initialized vending machine (default)", "SUCCESS");
    }

    public StatusMsg initVendingMachine(ArrayList<Product> products, Map<Integer, Integer> deposit) {
        StatusMsg statusMsg = null;
        for (Product product : products) {
            statusMsg = initProduct(
                    new Product(product.getProductName(), product.getProductPrice(), product.getProductQty()));
            if (statusMsg.getStatus().equalsIgnoreCase("FAILED"))
                return statusMsg;
        }

        for (Map.Entry<Integer, Integer> cash : deposit.entrySet()) {
            statusMsg = initCash(new Cash(cash.getKey(), cash.getValue()));
            if (statusMsg.getStatus().equalsIgnoreCase("FAILED"))
                return statusMsg;
        }

        return new StatusMsg("Initialized vending machine", "SUCCESS");
    }

    private int getAmountFromCoins(Map<Integer, Integer> cash) {
        int total = 0;

        for (Map.Entry<Integer, Integer> entry : cash.entrySet()) {
            switch (entry.getKey()) {
            case CENTS_5:
                total += entry.getValue() * CENTS_5;
                break;
            case CENTS_10:
                total += entry.getValue() * CENTS_10;
                break;
            case CENTS_20:
                total += entry.getValue() * CENTS_20;
                break;
            case CENTS_50:
                total += entry.getValue() * CENTS_50;
                break;
            case CENTS_100:
                total += entry.getValue() * CENTS_100;
                break;
            default:
                // can't get here
                break;
            }
        }

        return total;
    }

    private Map<Integer, Integer> returnChange(int amount) {
        Map<Integer, Integer> amountCoins = initCoinMap();
        List<Integer> coinList = initCoinList();

        for (Integer coinType : coinList) {
            if (amount == 0)
                break;
            if (amount / coinType <= cash.get(coinType)) {
                // enough coins of type in cash
                amountCoins.put(coinType, amountCoins.get(coinType) + (amount / coinType));
                cash.put(coinType, cash.get(coinType) - (amount / coinType));
                amount -= (amount / coinType) * coinType;
            } else if (amount / coinType > cash.get(coinType)) {
                // not enough coins of type in cash; take all and look at the rest
                amountCoins.put(coinType, amountCoins.get(coinType) + cash.get(coinType));
                cash.put(coinType, 0);
                amount -= cash.get(coinType) * coinType;
            }
        }

        if (amount != 0) {
            // if no exact change; add coins back to cash
            return null;
        }

        return amountCoins;
    }

    // assume products of requested type are always in the vending machine;
    // user cannot buy a product that's not in the vending machine
    private int getTotalProductsPrice(List<Product> products) {
        int totalProductsPrice = 0;
        for (Product product : products) {
            // don't allow users to set the price of products :-)
            Optional<Product> productDb = productRepository.findById(product.getId());
            totalProductsPrice += productDb.get().getProductPrice() * product.getProductQty();
        }

        return totalProductsPrice;
    }

    private void addDepositToCash(Map<Integer, Integer> deposit) {
        for (Map.Entry<Integer, Integer> entry : deposit.entrySet()) {
            cash.put(entry.getKey(), cash.get(entry.getKey()) + entry.getValue());
        }
    }

    private Map<Integer, Integer> initCoinMap() {
        Map<Integer, Integer> change = new HashMap<Integer, Integer>();
        change.put(CENTS_5, 0);
        change.put(CENTS_10, 0);
        change.put(CENTS_20, 0);
        change.put(CENTS_50, 0);
        change.put(CENTS_100, 0);

        return change;
    }

    private List<Integer> initCoinList() {
        List<Integer> coinList = new LinkedList<Integer>();
        coinList.add(CENTS_100);
        coinList.add(CENTS_50);
        coinList.add(CENTS_20);
        coinList.add(CENTS_10);
        coinList.add(CENTS_5);

        return coinList;
    }

    private boolean areThereTheRightProductsInVendingMachine(List<Product> products) {
        for (Product product : products) {
            boolean isProductInVendingMachine = true;
            Optional<Product> dbProduct = productRepository.findById(product.getId());
            if (!dbProduct.isPresent())
                return false;
        }
        return true;
    }

    private boolean areThereEnoughProductsInVendingMachine(List<Product> products) {
        for (Product product : products) {
            boolean isProductInStock = false;
            for (Product vendingMachineProduct : this.products) {
                if (product.getId() == vendingMachineProduct.getId()) {
                    // check if there are no products
                    if (vendingMachineProduct.getProductQty() == 0)
                        return false;
                    // check if there are enough products
                    if (vendingMachineProduct.getProductQty() < product.getProductQty())
                        return false;
                    else {
                        isProductInStock = true;
                        break;
                    }
                }
            }
            if (!isProductInStock)
                return false;
        }
        return true;
    }

    private void remProductsFromVendingMachine(List<Product> productsToRemove) {
        for (Product product : productsToRemove) {
            for (Product vendingMachineProduct : this.products) {
                // at this point there are always enough products in
                // the vending machine
                if (product.getId() == vendingMachineProduct.getId()) {
                    vendingMachineProduct
                            .setProductQty(vendingMachineProduct.getProductQty() - product.getProductQty());
                }
            }
        }
    }

    private void persistProductsAndCashToDb(List<Product> productsToPersist) {
        remProductsFromVendingMachine(productsToPersist);
        // update products and cash in db
        for (Product product : this.products) {
            productRepository.findById(product.getId()).map(productInDb -> {
                productInDb.setProductQty(productInDb.getProductQty());
                return productInDb;
            }).orElseThrow(() -> new ProductNotFoundException("Could not persist product with the id " + product.getId()
                    + "; couldn't be found in the database."));
        }

        for (Cash cashEntryDb : cashRepository.findAll())
            cashEntryDb.setCoinCount(cash.get(cashEntryDb.getCoinType()));
    }

    private void saveProductsAndCashToMem() {
        this.products.clear();
        log.info("Products: ");
        for (Product product : productRepository.findAll()) {
            this.products.add(product);
            log.info(product.toString());
        }

        this.cash.clear();
        log.info("Cash: ");
        for (Cash cash : cashRepository.findAll()) {
            this.cash.put(cash.getCoinType(), cash.getCoinCount());
            log.info(cash.toString());
        }
    }

    // returns change
    public Order buy(Order order) {
        log.info("Processing order ... ");

        // get products and cash from db; work with in-memory models
        saveProductsAndCashToMem();

        // add deposit to cash but keep it in memory in case user cancels, or not enough
        // change; do not persist
        addDepositToCash(order.getDeposit());

        int totalProductsPrice = getTotalProductsPrice(order.getProducts());
        int totalDeposit = getAmountFromCoins(order.getDeposit());

        // are the requested products in the vending machine?
        if (!areThereTheRightProductsInVendingMachine(order.getProducts())) {
            StatusMsg statusMsg = new StatusMsg(
                    "Either the products were not found or there is a mismatch between their id and name", "FAILED");
            // return unchanged deposit and no products; do not persist cash or products
            return new Order(order.getProducts(), order.getDeposit(), statusMsg);
        }

        // are there enough products in the vending machine?
        if (!areThereEnoughProductsInVendingMachine(order.getProducts())) {
            StatusMsg statusMsg = new StatusMsg("Not enough products in vending machine", "FAILED");
            // return unchanged deposit and no products; do not persist cash or products
            return new Order(order.getProducts(), order.getDeposit(), statusMsg);
        }

        // is there enough cash in the deposit?
        if (totalProductsPrice > totalDeposit) {
            StatusMsg statusMsg = new StatusMsg("Not enough cash in deposit", "FAILED");
            // return unchanged deposit and no products; do not persist cash or products
            return new Order(order.getProducts(), order.getDeposit(), statusMsg);
        }

        int balance = totalDeposit - totalProductsPrice;
        // exact amount?
        if (balance == 0) {
            StatusMsg statusMsg = new StatusMsg("Purchase completed", "SUCCESS");
            // get products out of vending machine
            persistProductsAndCashToDb(order.getProducts());
            // return empty change to distinguish from
            // null (change cannot be paid with current coins)
            return new Order(order.getProducts(), initCoinMap(), statusMsg);
        }

        // is there change for all the products in the vending machine?
        Map<Integer, Integer> change = returnChange(balance);
        if (change == null) {
            StatusMsg statusMsg = new StatusMsg("Cannot complete purchase; no exact change", "FAILED");
            return new Order(order.getProducts(), order.getDeposit(), statusMsg);
        }

        StatusMsg statusMsg = new StatusMsg("Purchase completed", "SUCCESS");
        // get products out of vending machine
        persistProductsAndCashToDb(order.getProducts());
        return new Order(order.getProducts(), change, statusMsg);
    }
}