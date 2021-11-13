package de.jonashackt.springbootvuejs.authentication.server.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.TokenStore;

import de.jonashackt.springbootvuejs.authentication.server.configuration.properties.AppProperties;
import de.jonashackt.springbootvuejs.authentication.server.accounts.AccountService;

@Configuration
@EnableAuthorizationServer
public class AuthServerConfig extends AuthorizationServerConfigurerAdapter {

    private static final Logger LOG = LoggerFactory.getLogger(AuthServerConfig.class);

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AccountService accountService;

    @Autowired
    private TokenStore tokenStore;

    @Autowired
    private AppProperties appProperties;

    @Override
    public void configure(AuthorizationServerSecurityConfigurer security) throws Exception {
        LOG.info("Configure security");
        security.passwordEncoder(passwordEncoder);
    }

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        LOG.info("Configure clients");
        clients.inMemory().withClient(appProperties.getClientId()).authorizedGrantTypes("password", "refresh_token")
                .scopes("read", "write").secret("{noop}" + appProperties.getClientSecret())
                .accessTokenValiditySeconds(6 * 10 * 60).refreshTokenValiditySeconds(6 * 10 * 60);
    }

    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        LOG.info("Configure endpoints");
        endpoints.pathMapping("/oauth/token", "/api/oauth/token").authenticationManager(authenticationManager)
                .userDetailsService(accountService).tokenStore(tokenStore);
    }
}
