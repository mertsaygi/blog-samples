import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import DynamodbStreams = require('../lib/dynamodb-streams-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new DynamodbStreams.DynamodbStreamsStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
