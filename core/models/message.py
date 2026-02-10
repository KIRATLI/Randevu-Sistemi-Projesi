from django.db import models


# Thread for gluing related messages together

class Thread(models.Model):
    participants = models.ManyToManyField('core.AbstractCustomUser', related_name='threads')
    subject = models.CharField(max_length=255)
    updated_at = models.DateTimeField(auto_now=True)

    # TODO connect an appointment to the Thread for referencing an appointment

    def __str__(self):
        return f"Thread: {self.subject}"

    def get_receiver(self, current_user):
        """
        Returns the other participant in a 2-person thread.
        """
        return self.participants.exclude(id=current_user.id).first()

    class Meta:
        ordering = ['-updated_at']


# Individual messages within a thread

class Message(models.Model):
    thread = models.ForeignKey(Thread,on_delete=models.CASCADE,related_name='messages')
    sender = models.ForeignKey('core.AbstractCustomUser',on_delete=models.CASCADE,related_name='sent_messages')
    # receiver -> access it from the thread.
    content = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    reply_to = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='replies')

    class Meta:
        ordering = ['date'] # This handles the chronological order of messages in a thread

    def __str__(self):
        return f"Message by {self.sender} in {self.thread.subject}"