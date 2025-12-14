#!/bin/bash

# Quick script to add firstName/lastName to existing users in MongoDB

echo "Fixing existing user data in MongoDB..."

docker exec farm-mongo mongosh \
  -u root \
  -p password \
  --authenticationDatabase admin \
  hobby-farm \
  --eval '
    db.users.updateMany(
      { firstName: { $exists: false } },
      {
        $set: {
          firstName: "Test",
          lastName: "User"
        }
      }
    )
  '

echo "Done! Existing users now have firstName and lastName fields."
