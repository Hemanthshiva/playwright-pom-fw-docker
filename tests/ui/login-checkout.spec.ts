import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { getRandomUser } from '../../helpers/userUtils';
import { UserData } from '../../types/user';

test.describe('Login and Checkout', () => {
    test('should login and complete checkout with registered user', async ({ page }) => {
        const homePage = new HomePage(page);
        const loginPage = new LoginPage(page);
        const productPage = new ProductPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        // Get registered user data from test data
        const userData: UserData = await getRandomUser();

        // Login
        await homePage.goto('/');
        await homePage.navigateToSignIn();
        await loginPage.login(userData.email, userData.password);

        // Select and add product to cart
        await homePage.selectRandomProduct();
        await productPage.addToCart();
        await productPage.proceedToCheckout();

        // Proceed with checkout
        await cartPage.proceedToCheckout();

        // Fill shipping address
        const address = {
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            state: 'Alabama', // Using a specific state from the dropdown
            postcode: faker.location.zipCode('#####')
        };

        await checkoutPage.fillAddress(address);
        await checkoutPage.selectShippingMethod();
        await checkoutPage.selectPaymentMethod();

        // Verify order confirmation
        const orderReference = await checkoutPage.getOrderConfirmation();
        expect(orderReference).not.toBeNull();
    });
});