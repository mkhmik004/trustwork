# TrustWork - Empowering South Africa's Freelance Economy

## The Problem We're Solving

In South Africa, many people struggle to access high-quality, affordable services. Large companies often charge premium rates, putting skilled services out of reach for everyday clients. At the same time, talented local freelancers lack visibility, and unscrupulous contractors sometimes take upfront payments without delivering work.

## Our Solution

TrustWork is a decentralized freelance platform that connects South African clients directly with local talent at fair prices. Built with blockchain technology, smart contract escrow, and MiniKit wallet integration, we eliminate the risk of payment fraud while supporting the local economy.

**Key Benefits:**
- 🇿🇦 **Support Local Talent**: Connect with skilled South African freelancers
- 💰 **Fair Pricing**: Pay 50-70% less than big agencies
- 🛡️ **Zero Risk**: Blockchain escrow prevents payment fraud
- ⚡ **Instant Payments**: Freelancers get paid immediately upon milestone completion
- 🌍 **Same Timezone**: Work with professionals in your time zone

## Features

- 🔐 **Secure Escrow System**: Smart contract-based escrow with milestone releases
- 💼 **Service Marketplace**: Browse and book freelance services
- 🔗 **Blockchain Integration**: Built on Base testnet with ethers.js
- 📱 **MiniKit Wallet**: Seamless wallet connection and transactions
- 📊 **Dashboard**: Track active contracts, milestones, and reviews
- 💾 **Database Integration**: Prisma ORM with SQLite/PostgreSQL support

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Blockchain**: Solidity, Hardhat, ethers.js
- **Database**: Prisma ORM, SQLite (dev) / PostgreSQL (prod)
- **Wallet**: MiniKit integration
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ (recommended for Mac M1)
- npm or yarn
- Git
- MetaMask or MiniKit wallet

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd trustwork
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:

```env
# Database
DATABASE_URL="file:./dev.db"

# Base Testnet Configuration
NEXT_PUBLIC_BASE_RPC_URL="https://sepolia.base.org"
NEXT_PUBLIC_CHAIN_ID="84532"

# Contract Deployment (fill after deployment)
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=""

# MiniKit Configuration
NEXT_PUBLIC_MINIKIT_APP_ID="your_minikit_app_id"

# Development
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup

Initialize and migrate the database:

```bash
npx prisma generate
npx prisma db push
```

### 4. Smart Contract Deployment

#### Compile Contracts

```bash
npx hardhat compile
```

#### Deploy to Base Testnet

1. Get Base Sepolia ETH from [Base Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

2. Create a `.env` file in the root directory:

```env
PRIVATE_KEY="your_wallet_private_key"
BASE_RPC_URL="https://sepolia.base.org"
```

3. Deploy the contract:

```bash
npx hardhat run scripts/deploy.ts --network base-sepolia
```

4. Copy the deployed contract address to your `.env.local`:

```env
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS="0x..."
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

### Run Smart Contract Tests

```bash
npx hardhat test
```

### Run Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run type-check
```

## Production Deployment

### Vercel Deployment

1. **Connect Repository**:
   - Fork this repository
   - Connect your GitHub account to Vercel
   - Import the project

2. **Environment Variables**:
   Set the following environment variables in Vercel:

   ```env
   DATABASE_URL="postgresql://username:password@host:port/database"
   NEXT_PUBLIC_BASE_RPC_URL="https://sepolia.base.org"
   NEXT_PUBLIC_CHAIN_ID="84532"
   NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS="your_deployed_contract_address"
   NEXT_PUBLIC_MINIKIT_APP_ID="your_minikit_app_id"
   NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
   ```

3. **Database Setup**:
   - Set up a PostgreSQL database (recommended: Supabase, PlanetScale, or Neon)
   - Run migrations: `npx prisma db push`

4. **Deploy**:
   ```bash
   vercel --prod
   ```

### Contract Verification (Optional)

Verify your contract on BaseScan:

```bash
npx hardhat verify --network base-sepolia <CONTRACT_ADDRESS>
```

## Project Structure

```
truswork/
├── contracts/           # Solidity smart contracts
│   └── Escrow.sol      # Main escrow contract
├── scripts/            # Deployment scripts
│   └── deploy.ts       # Contract deployment
├── test/               # Smart contract tests
│   └── Escrow.test.ts  # Escrow contract tests
├── src/
│   ├── app/            # Next.js app directory
│   │   ├── app/        # Main app page
│   │   └── layout.tsx  # Root layout
│   ├── components/     # React components
│   │   ├── booking-form.tsx
│   │   ├── escrow-dashboard.tsx
│   │   ├── review-section.tsx
│   │   └── service-list.tsx
│   ├── hooks/          # Custom React hooks
│   │   ├── use-escrow.ts
│   │   └── use-wallet.ts
│   ├── lib/            # Utility libraries
│   │   └── ethers.ts   # Ethereum contract interactions
│   └── types/          # TypeScript type definitions
│       └── ethereum.ts # Ethereum provider types
├── prisma/             # Database schema
│   └── schema.prisma   # Prisma schema
└── hardhat.config.ts   # Hardhat configuration
```

## Smart Contract Architecture

### Escrow Contract

The main `Escrow.sol` contract handles:

- **Job Creation**: Clients create jobs with milestones
- **Funding**: Clients fund the escrow with ETH
- **Milestone Release**: Clients release payments for completed milestones
- **Dispute Resolution**: Basic refund mechanism

### Key Functions

- `createContract(address freelancer, uint256[] milestoneAmounts)`: Create new escrow
- `fundContract(uint256 contractId)`: Fund the escrow
- `releaseMilestone(uint256 contractId, uint256 milestoneIndex)`: Release milestone payment
- `refund(uint256 contractId)`: Refund remaining funds to client

## Deployment

### Vercel Deployment

#### Prerequisites
- Vercel account (free tier available)
- GitHub repository with your code
- Environment variables configured

#### Quick Deploy

1. **Using the deployment script**:
   ```bash
   ./deploy.sh
   ```

2. **Manual deployment**:
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Build locally first
   npm run build
   
   # Deploy to preview
   vercel
   
   # Deploy to production
   vercel --prod
   ```

#### Environment Variables Setup

In your Vercel dashboard, add these environment variables:

```bash
# Database (use PostgreSQL for production)
DATABASE_URL="postgresql://username:password@host:port/database"

# Base Network Configuration
NEXT_PUBLIC_BASE_RPC_URL="https://sepolia.base.org"
NEXT_PUBLIC_CHAIN_ID="84532"

# Smart Contract (deploy first, then add address)
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS="0x..."

# MiniKit Configuration
NEXT_PUBLIC_MINIKIT_APP_ID="your_minikit_app_id"

# Application URL (update after deployment)
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

#### Post-Deployment Steps

1. **Update App URL**: After first deployment, update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
2. **Deploy Smart Contracts**: Deploy your Escrow contract to Base testnet
3. **Update Contract Address**: Add the deployed contract address to environment variables
4. **Test Farcaster Frame**: Verify frame integration works correctly

### Farcaster Integration

#### Frame Setup

Your app is automatically configured as a Farcaster Frame with:
- Frame endpoint: `https://your-app.vercel.app/api/frame`
- Image generation: `https://your-app.vercel.app/api/frame/image`
- Splash screen: `https://your-app.vercel.app/api/frame/splash`

#### Testing Frame Integration

1. **Local Testing**:
   ```bash
   # Start development server
   npm run dev
   
   # Test frame endpoints
   curl http://localhost:3000/api/frame
   ```

2. **Frame Validator**: Use Farcaster's frame validator to test your deployed frame

3. **Warpcast Integration**: Share your frame URL in Warpcast to test live integration

#### MiniKit Configuration

1. **Get MiniKit App ID**:
   - Visit [MiniKit Developer Portal](https://developers.farcaster.xyz/)
   - Create a new app
   - Copy your App ID

2. **Configure App Settings**:
   - App Name: "TrustWork"
   - App URL: Your Vercel deployment URL
   - Frame URL: `https://your-app.vercel.app/api/frame`

### Smart Contract Deployment

#### Deploy to Base Testnet

1. **Configure Hardhat**:
   ```bash
   # Ensure you have Base testnet configured in hardhat.config.ts
   # Add your private key to .env (never commit this!)
   PRIVATE_KEY="your_private_key_here"
   ```

2. **Deploy Contract**:
   ```bash
   # Compile contracts
   npm run hardhat:compile
   
   # Deploy to Base testnet
   npm run hardhat:deploy
   ```

3. **Verify Contract** (optional):
   ```bash
   npx hardhat verify --network baseTestnet <CONTRACT_ADDRESS>
   ```

4. **Update Environment Variables**: Add the deployed contract address to your Vercel environment variables

### Database Setup (Production)

#### PostgreSQL Setup

1. **Choose a Provider**:
   - [Supabase](https://supabase.com/) (recommended, free tier)
   - [PlanetScale](https://planetscale.com/)
   - [Railway](https://railway.app/)
   - [Neon](https://neon.tech/)

2. **Configure Database**:
   ```bash
   # Update DATABASE_URL in Vercel environment variables
   DATABASE_URL="postgresql://username:password@host:port/database"
   ```

3. **Run Migrations**:
   ```bash
   # After updating DATABASE_URL
   npx prisma db push
   ```

### Monitoring and Analytics

#### Vercel Analytics
- Enable Vercel Analytics in your dashboard
- Monitor performance and usage

#### Error Tracking
- Consider integrating Sentry for error tracking
- Monitor smart contract interactions

### Custom Domain (Optional)

1. **Add Domain in Vercel**:
   - Go to your project settings
   - Add your custom domain
   - Configure DNS records

2. **Update Environment Variables**:
   ```bash
   NEXT_PUBLIC_APP_URL="https://your-custom-domain.com"
   ```

### Security Considerations

- Never commit private keys or sensitive data
- Use environment variables for all configuration
- Enable Vercel's security headers
- Regularly update dependencies
- Monitor smart contract interactions

## Troubleshooting

### Common Issues on Mac M1

1. **Node.js Compatibility**:
   ```bash
   # Use Node.js 18+ LTS
   nvm install 18
   nvm use 18
   ```

2. **Native Dependencies**:
   ```bash
   # Clear cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Hardhat Compilation Issues**:
   ```bash
   # Clear Hardhat cache
   npx hardhat clean
   npx hardhat compile
   ```

### Database Issues

1. **Prisma Generation**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

2. **Reset Database**:
   ```bash
   npx prisma db push --force-reset
   ```

### Wallet Connection Issues

1. **Network Configuration**: Ensure Base Sepolia is added to your wallet
2. **MiniKit Setup**: Verify your MiniKit app ID is correct
3. **RPC Issues**: Try alternative RPC endpoints if connection fails

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the Base network documentation

---

**Built with ❤️ for the decentralized future of work**
# trustwork
