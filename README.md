# Vending Machine

Vending machine project loosely based on:

https://github.com/jonashackt/spring-boot-vuejs

Logic:

 1. Setup

   * the vending machine has slots for each type of coin (hash map)
   * prices are given in the smallest unit (there are no banknotes, only coins,
      for example a product that costs 100 cents costs 100 cents and not a dollar => no fractional values)
   * the vending machine may or may not have coins in it when the api launches (start
      of day, initial supply)
   * the vending machine may or may not have been stocked with products
   * the vending machine always returns change; if there is no exact change, returns deposited
      cash back to user, clears shopping session
   * there is no upper limit on products it can store (neither types nor quantity of product)
   * no upper limit on cash
   * the vending machine can be refilled (product by product, or batches of different products)
   * the vending machine's revenue can be fetched
   * one session per user; if a user deposits cash and leaves the machine, the next user
      to use the machine will start with a new session (no access to previous deposit)
   * there's a possibility for race conditions; if one user buys an item to which the machine
      has enough change and another buys an item for which the machine also has change but after
      the first user finishes, the machine can no longer return exact change; one user
      will get a return of their deposit and no product(s) (transactions are ACID)
   * same applies if the machine is either restocked or has its cash replenished
   * cash has to be initialized even if empty (coins of each type must be present)

 2. Flow

   1)  User deposits coins
   2)  Picks products
   3)  Hits purchase
   4)  The vending machine checks if product is present, if not returns deposit/notify user
   5)  If product(s) is(are) present the vending machine checks quantity, if not enough products return deposit/notify user
   6)  Vending machine checks user deposit, if not enough returns deposit/notify user
   7)  If deposit is enough, checks if it can return exact change, if not return deposit/notify user
   8)  All's good, return products and change
   8*) The vending machine tries to return change in highest amounts of coin (e.g. 25 cents as change would be
       1 x 20 cents + 1 x 5 cents rather than 5 x 5 cents (if the cash deposit allows it)
   9)  Deposit is stored to the cash
   
## Upgrade procedure

Get newest node & npm:
```shell
brew upgrade node
npm install -g npm@latest
```

Update vue-cli
```shell
npm install -g @vue/cli
```

Update Vue components/plugins (see https://cli.vuejs.org/migrating-from-v3/#upgrade-all-plugins-at-once)
```shell
vue upgrade
```

## Todos left:

* rewrite/expand tests (both front/backend)
* add styling to frontend (purchase animation/router header)
* split up vuex store into separate files (separate packages for user crud/auth and vending machine logic) 





